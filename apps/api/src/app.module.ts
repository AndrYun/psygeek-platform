import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ClientInvitesModule } from './client-invites/client-invites.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ClientInvitesModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
