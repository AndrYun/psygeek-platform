import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ClientInvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(psychologistId: string, email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const psychologist = await this.prisma.user.findUnique({
      where: { id: psychologistId },
      select: { role: true, status: true },
    });

    if (
      !psychologist ||
      psychologist.role !== 'PSYCHOLOGIST' ||
      psychologist.status !== 'ACTIVE'
    ) {
      throw new ForbiddenException('Active psychologist account required');
    }

    const existingClient = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        role: true,
      },
    });

    if (existingClient && existingClient.role !== 'CLIENT') {
      throw new BadRequestException(
        'This email belongs to an account that cannot accept a client invite',
      );
    }

    if (existingClient) {
      const relation = await this.prisma.therapistClientRelation.findUnique({
        where: {
          psychologistId_clientId: {
            psychologistId,
            clientId: existingClient.id,
          },
        },
        select: { status: true },
      });

      if (relation?.status === 'ACTIVE') {
        throw new ConflictException('This user is already an active client');
      }

      if (relation?.status === 'BLOCKED') {
        throw new ConflictException('This client relationship is blocked');
      }
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.clientInvite.create({
      data: {
        psychologistId,
        email: normalizedEmail,
        tokenHash,
        expiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const inviteUrl = `${frontendUrl}/accept-invite?token=${rawToken}`;

    return {
      message: 'Invite created',
      expiresAt,
      // Только для локальной разработки. В production ссылку должен отправлять email-сервис.
      ...(process.env.NODE_ENV !== 'production' ? { inviteUrl } : {}),
    };
  }

  async accept(clientId: string, rawToken: string) {
    if (!rawToken?.trim()) {
      throw new BadRequestException('Invite token is required');
    }

    const tokenHash = this.hashToken(rawToken);
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const client = await tx.user.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      });

      if (!client || client.role !== 'CLIENT' || client.status !== 'ACTIVE') {
        throw new ForbiddenException('Active client account required');
      }

      const invite = await tx.clientInvite.findUnique({
        where: { tokenHash },
        select: {
          id: true,
          psychologistId: true,
          email: true,
          expiresAt: true,
          acceptedAt: true,
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite not found');
      }

      if (invite.acceptedAt) {
        throw new ConflictException('Invite has already been accepted');
      }

      if (invite.expiresAt <= now) {
        throw new BadRequestException('Invite has expired');
      }

      if (invite.email !== client.email.toLowerCase()) {
        throw new ForbiddenException(
          'This invite was created for a different email address',
        );
      }

      const claimed = await tx.clientInvite.updateMany({
        where: {
          id: invite.id,
          acceptedAt: null,
          expiresAt: { gt: now },
        },
        data: { acceptedAt: now },
      });

      if (claimed.count !== 1) {
        throw new ConflictException('Invite is no longer available');
      }

      const existingRelation = await tx.therapistClientRelation.findUnique({
        where: {
          psychologistId_clientId: {
            psychologistId: invite.psychologistId,
            clientId: client.id,
          },
        },
        select: { status: true },
      });

      if (existingRelation?.status === 'BLOCKED') {
        throw new ConflictException('This client relationship is blocked');
      }

      const relation = await tx.therapistClientRelation.upsert({
        where: {
          psychologistId_clientId: {
            psychologistId: invite.psychologistId,
            clientId: client.id,
          },
        },
        create: {
          psychologistId: invite.psychologistId,
          clientId: client.id,
          status: 'ACTIVE',
        },
        update: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          psychologistId: true,
          clientId: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        message: 'Invite accepted',
        relation,
      };
    });
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async listClients(psychologistId: string) {
    const relations = await this.prisma.therapistClientRelation.findMany({
      where: {
        psychologistId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return relations;
  }
}
