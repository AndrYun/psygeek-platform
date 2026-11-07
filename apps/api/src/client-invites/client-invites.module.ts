import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ClientInvitesController } from './client-invites.controller.js';
import { ClientInvitesService } from './client-invites.service.js';

@Module({
  imports: [AuthModule, JwtModule.register({})],
  controllers: [ClientInvitesController],
  providers: [ClientInvitesService, RolesGuard],
})
export class ClientInvitesModule {}
