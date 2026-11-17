import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  clientId: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;
}
