'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getMe } from '@/features/auth/api/auth-api';
import { DashboardUserContext } from '@/features/dashboard/model/dashboard-user-context';
import { removeAccessToken } from '@/shared/lib/token';
import type { User, UserRole } from '@/shared/types/auth';

type NavItem = {
  href: string;
  label: string;
};

const navByRole: Record<UserRole, NavItem[]> = {
  PSYCHOLOGIST: [
    { href: '/dashboard', label: 'Обзор' },
    { href: '/dashboard/calendar', label: 'Календарь' },
    { href: '/dashboard/clients', label: 'Клиенты' },
    { href: '/dashboard/messages', label: 'Сообщения' },
    { href: '/dashboard/homeworks', label: 'Домашние задания' },
  ],
  CLIENT: [
    { href: '/dashboard', label: 'Обзор' },
    { href: '/dashboard/calendar', label: 'Мои встречи' },
    { href: '/dashboard/messages', label: 'Сообщения' },
    { href: '/dashboard/homeworks', label: 'Домашние задания' },
  ],
  ADMIN: [{ href: '/dashboard', label: 'Обзор' }],
};

export default function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const currentUser = await getMe();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        removeAccessToken();
        router.replace('/login');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    removeAccessToken();
    router.replace('/login');
  }

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] text-slate-600">
        Загружаем личный кабинет…
      </main>
    );
  }

  const displayName =
    [user.profile?.firstName, user.profile?.lastName]
      .filter(Boolean)
      .join(' ') || user.email;

  return (
    <DashboardUserContext.Provider value={user}>
      <div className="min-h-screen bg-[#f7f7f4] text-slate-900 md:grid md:grid-cols-[250px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:border-b-0 md:border-r">
          <Link
            href="/dashboard"
            className="mb-5 block text-xl font-semibold tracking-tight"
          >
            Psygeek
          </Link>

          <p className="mb-4 truncate text-sm text-slate-500">{displayName}</p>

          <nav className="flex flex-wrap gap-2 md:flex-col">
            {navByRole[user.role].map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-5 rounded-xl px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Выйти
          </button>
        </aside>

        <div className="min-w-0">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-5 py-4 md:px-8">
            <div>
              <p className="text-sm text-slate-500">Личный кабинет</p>
              <p className="font-medium">{displayName}</p>
            </div>

            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
              {user.role === 'PSYCHOLOGIST'
                ? 'Психолог'
                : user.role === 'CLIENT'
                ? 'Клиент'
                : 'Администратор'}
            </span>
          </header>

          <main className="mx-auto w-full max-w-6xl p-5 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardUserContext.Provider>
  );
}
