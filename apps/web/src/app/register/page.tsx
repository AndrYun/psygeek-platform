'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/src/features/auth/api/auth-api';
import { setAccessToken } from '@/src/shared/lib/token';
import type { UserRole } from '@/src/shared/types/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError('');

      const response = await register({
        email,
        password,
        role,
        firstName,
        lastName,
      });

      setAccessToken(response.accessToken);

      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
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
        <h1 className="mb-2 text-3xl font-semibold">Создать аккаунт</h1>

        <p className="mb-8 text-sm text-neutral-400">
          Зарегистрируйтесь как клиент или психолог.
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
            placeholder="Минимум 8 символов"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm text-neutral-300">Роль</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-500"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="CLIENT">Клиент</option>
            <option value="PSYCHOLOGIST">Психолог</option>
          </select>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">Имя</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-500"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Анна"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Фамилия
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-500"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Иванова"
            />
          </div>
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
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Уже есть аккаунт?{' '}
          <a className="text-blue-400 hover:text-blue-300" href="/login">
            Войти
          </a>
        </p>
      </form>
    </main>
  );
}
