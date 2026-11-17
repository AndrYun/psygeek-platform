import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { JwtPayload } from '../auth/types/jwt-payload.type.js';
import type { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { userInfo } from 'os';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(psychologist: JwtPayload, dto: CreateAppointmentDto) {
    if (psychologist.role !== 'PSYCHOLOGIST') {
      throw new ForbiddenException(
        'Only psychologists can create appointments',
      );
    }

    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      endsAt <= startsAt
    ) {
      throw new BadRequestException('endsAt must be later than startsAt');
    }

    if (startsAt <= new Date()) {
      throw new BadRequestException('Appointment must start in the future');
    }

    const relation = await this.prisma.therapistClientRelation.findUnique({
      where: {
        psychologistId_clientId: {
          psychologistId: psychologist.sub,
          clientId: dto.clientId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!relation || relation.status !== 'ACTIVE') {
      throw new NotFoundException('Active client relationship not found');
    }

    const overlappingAppointment = await this.prisma.appointment.findFirst({
      where: {
        relationId: relation.id,
        status: 'SCHEDULED',
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { id: true },
    });

    if (overlappingAppointment) {
      throw new ConflictException(
        'This client already has an appointment at that time',
      );
    }

    return this.prisma.appointment.create({
      data: {
        psychologistId: psychologist.sub,
        clientId: dto.clientId,
        relationId: relation.id,
        startsAt,
        endsAt,
      },
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        status: true,
        createdAt: true,
        relation: {
          select: {
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
        },
      },
    });
  }

  async listForUser(user: JwtPayload) {
    let relationFilter:
      { is: { psychologistId: string } } | { is: { clientId: string } };

    if (user.role === 'PSYCHOLOGIST') {
      relationFilter = { is: { psychologistId: user.sub } };
    } else if (user.role === 'CLIENT') {
      relationFilter = { is: { clientId: user.sub } };
    } else {
      throw new ForbiddenException('This account cannot access appointments');
    }

    return this.prisma.appointment.findMany({
      where: {
        relation: relationFilter,
      },
      orderBy: {
        startsAt: 'asc',
      },
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        status: true,
        relation: {
          select: {
            psychologist: {
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
        },
      },
    });
  }
}
