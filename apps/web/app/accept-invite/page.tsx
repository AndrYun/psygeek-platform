'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { acceptClientInvite } from '@/features/client-invites/api/client-invites-api';
import { getAccessToken } from '@/shared/lib/token';

export default function AcceptInvitePage() {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setToken(params.get('token') ?? '');
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  async function handleAccept() {
    setError('');
    setMessage('');
    setIsAccepting(true);

    try {
      const result = await acceptClientInvite(token);
      setMessage(result.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось принять приглашение'
      );
    } finally {
      setIsAccepting(false);
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Приглашение не найдено</h1>
          <p className="mt-2 text-slate-600">
            В ссылке отсутствует токен. Проверь, что скопирована полная ссылка.
          </p>
        </section>
      </main>
    );
  }

  const returnTo = `/accept-invite?token=${encodeURIComponent(token)}`;
  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  const registerHref = `/register?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Psygeek</p>
        <h1 className="mt-2 text-2xl font-semibold">Приглашение психолога</h1>
        <p className="mt-2 text-slate-600">
          Войди или зарегистрируйся как клиент с адресом email, на который
          отправлено приглашение.
        </p>

        {!isLoggedIn && (
          <div className="mt-6 flex gap-3">
            <Link
              href={loginHref}
              className="rounded-xl bg-slate-900 px-4 py-3 text-white"
            >
              Войти
            </Link>
            <Link
              href={registerHref}
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              Регистрация
            </Link>
          </div>
        )}

        {isLoggedIn && !message && (
          <button
            type="button"
            onClick={() => void handleAccept()}
            disabled={isAccepting}
            className="mt-6 rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
          >
            {isAccepting ? 'Принимаем приглашение…' : 'Принять приглашение'}
          </button>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="font-medium">Приглашение принято</p>
            <p className="mt-1 text-sm text-slate-700">
              Теперь вы связаны с психологом.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-white"
            >
              Перейти в кабинет
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
