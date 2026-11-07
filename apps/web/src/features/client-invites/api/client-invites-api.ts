import { apiFetch } from '@/shared/api/http';

export type ClientRelation = {
  id: string;
  createdAt: string;
  client: {
    id: string;
    email: string;
    profile: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  };
};

export type CreateInviteResponse = {
  message: string;
  expiresAt: string;
  inviteUrl?: string;
};

export function getClients() {
  return apiFetch<ClientRelation[]>('/client-invites/clients', {
    auth: true,
  });
}

export function createClientInvite(email: string) {
  return apiFetch<CreateInviteResponse>('/client-invites', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ email }),
  });
}

export function acceptClientInvite(token: string) {
  return apiFetch<{ message: string }>('/client-invites/accept', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ token }),
  });
}
