'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/features/auth/api/auth-api';
import { setAccessToken } from '@/shared/lib/token';
import { getPostAuthPath } from '@/shared/lib/post-auth-path';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError('');

      const response = await login({
        email,
        password,
      });

      setAccessToken(response.accessToken);

      router.push(getPostAuthPath());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl"
      >
        <h1 className="mb-2 text-3xl font-semibold">Вход</h1>

        <p className="mb-8 text-sm text-neutral-400">
          Войдите в личный кабинет Psygeek.
        </p>

        <div className="mb-4">
          <label className="mb-2 block text-sm text-neutral-300">Email</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-500"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm text-neutral-300">Пароль</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-500"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ваш пароль"
            required
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          className="w-full rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Нет аккаунта?{' '}
          <a className="text-blue-400 hover:text-blue-300" href="/register">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </main>
  );
}
