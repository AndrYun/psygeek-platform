import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { CreateInviteDto } from './dto/create-invite.dto.js';
import { ClientInvitesService } from './client-invites.service.js';

@Controller('client-invites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientInvitesController {
  constructor(private readonly invitesService: ClientInvitesService) {}

  @Post()
  @Roles('PSYCHOLOGIST')
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateInviteDto) {
    return this.invitesService.create(user.sub, dto.email);
  }

  @Post('accept')
  @Roles('CLIENT')
  accept(@CurrentUser() user: JwtPayload, @Body('token') token: string) {
    return this.invitesService.accept(user.sub, token);
  }
}
