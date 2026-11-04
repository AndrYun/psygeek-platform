'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/src/features/auth/api/auth-api';
import { removeAccessToken } from '@/src/shared/lib/token';
import type { User } from '@/src/shared/types/auth';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);

        const currentUser = await getMe();

        setUser(currentUser);
      } catch {
        removeAccessToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [router]);

  function handleLogout() {
    removeAccessToken();
    router.push('/login');
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Загрузка...
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    [user.profile?.firstName, user.profile?.lastName]
      .filter(Boolean)
      .join(' ') || user.email;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm text-neutral-400">Psygeek Platform</p>
            <h1 className="text-2xl font-semibold">Личный кабинет</h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
          >
            Выйти
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-2 text-sm text-neutral-400">Вы вошли как</p>
          <h2 className="text-3xl font-semibold">{displayName}</h2>
          <p className="mt-2 text-neutral-400">{user.email}</p>

          <div className="mt-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
            {user.role}
          </div>
        </div>

        {user.role === 'PSYCHOLOGIST' && <PsychologistDashboardMock />}

        {user.role === 'CLIENT' && <ClientDashboardMock />}

        {user.role === 'ADMIN' && <AdminDashboardMock />}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}

function PsychologistDashboardMock() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardCard
        title="Сегодняшние встречи"
        description="Здесь будет список ближайших сессий."
      />
      <DashboardCard
        title="Клиенты"
        description="Здесь будет список ваших клиентов."
      />
      <DashboardCard
        title="Сообщения"
        description="Здесь будут новые сообщения от клиентов."
      />
    </div>
  );
}

function ClientDashboardMock() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardCard
        title="Следующая встреча"
        description="Здесь будет ближайшая встреча с психологом."
      />
      <DashboardCard
        title="Домашние задания"
        description="Здесь будут задания от психолога."
      />
      <DashboardCard
        title="Чат"
        description="Здесь будет история общения с психологом."
      />
    </div>
  );
}

function AdminDashboardMock() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardCard
        title="Пользователи"
        description="Административное управление пользователями."
      />
      <DashboardCard
        title="Система"
        description="Мониторинг состояния платформы."
      />
      <DashboardCard title="Логи" description="Аудит действий пользователей." />
    </div>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
}
