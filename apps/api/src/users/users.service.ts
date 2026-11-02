import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: this.defaultUserSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: this.defaultUserSelect,
    });
  }

  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: this.defaultUserSelect,
    });
  }

  create(data: {
    email: string;
    passwordHash: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      select: this.defaultUserSelect,
    });
  }

  private readonly defaultUserSelect = {
    id: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    profile: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        phone: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  } satisfies Prisma.UserSelect;
}
