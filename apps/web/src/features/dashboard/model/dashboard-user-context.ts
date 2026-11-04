'use client';

import { createContext, useContext } from 'react';
import type { User } from '@/shared/types/auth';

export const DashboardUserContext = createContext<User | null>(null);

export function useDashboardUser() {
  const user = useContext(DashboardUserContext);

  if (!user) {
    throw new Error(
      'useDashboardUser must be used inside DashboardUserContext.Provider'
    );
  }

  return user;
}
