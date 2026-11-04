import { apiFetch } from '@/src/shared/api/http';
import type { AuthResponse, User, UserRole } from '@/src/shared/types/auth';

export type RegisterPayload = {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export function register(payload: RegisterPayload) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiFetch<User>('/auth/me', {
    method: 'GET',
    auth: true,
  });
}
