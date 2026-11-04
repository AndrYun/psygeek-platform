export type UserRole = 'PSYCHOLOGIST' | 'CLIENT' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export type UserProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};
