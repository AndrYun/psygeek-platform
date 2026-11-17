import { apiFetch } from '@/shared/api/http';

export type Appointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  relation: {
    psychologist: {
      id: string;
      email: string;
      profile: {
        firstName: string | null;
        lastName: string | null;
      } | null;
    };
    client: {
      id: string;
      email: string;
      profile: {
        firstName: string | null;
        lastName: string | null;
      } | null;
    };
  };
};

export function getAppointments() {
  return apiFetch<Appointment[]>('/appointments', {
    auth: true,
  });
}

export function createAppointment(payload: {
  clientId: string;
  startsAt: string;
  endsAt: string;
}) {
  return apiFetch<Appointment>('/appointments', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}
