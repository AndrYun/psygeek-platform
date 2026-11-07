'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { useDashboardUser } from '@/features/dashboard/model/dashboard-user-context';
import {
  createClientInvite,
  getClients,
  type ClientRelation,
} from '@/features/client-invites/api/client-invites-api';

export default function ClientsPage() {
  const user = useDashboardUser();

  const [clients, setClients] = useState<ClientRelation[]>([]);
  const [email, setEmail] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);

  useEffect(() => {
    if (user.role !== 'PSYCHOLOGIST') return;

    let cancelled = false;

    async function loadClients() {
      setIsLoading(true);
      setError('');

      try {
        const result = await getClients();
        if (!cancelled) setClients(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Не удалось загрузить клиентов'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadClients();

    return () => {
      cancelled = true;
    };
  }, [user.role]);

  async function handleCreateInvite(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setInviteUrl('');
    setIsCreatingInvite(true);

    try {
      const result = await createClientInvite(email.trim());
      setEmail('');
      setInviteUrl(result.inviteUrl ?? '');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось создать приглашение'
      );
    } finally {
      setIsCreatingInvite(false);
    }
  }

  if (user.role !== 'PSYCHOLOGIST') {
    return (
      <section>
        <h1 className="text-3xl font-semibold">Клиенты</h1>
        <p className="mt-2 text-slate-600">
          Этот раздел доступен только психологам.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold">Клиенты</h1>
      <p className="mt-2 text-slate-600">
        Приглашайте клиентов и просматривайте активные связи.
      </p>

      <form
        onSubmit={handleCreateInvite}
        className="mt-6 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row"
      >
        <label className="sr-only" htmlFor="client-email">
          Email клиента
        </label>
        <input
          id="client-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="client@example.com"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-600"
        />
        <button
          type="submit"
          disabled={isCreatingInvite}
          className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {isCreatingInvite ? 'Создаём…' : 'Создать приглашение'}
        </button>
      </form>

      {inviteUrl && (
        <div className="mt-4 max-w-xl rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <p className="font-medium">Приглашение создано</p>
          <p className="mt-2 break-all text-sm text-slate-700">{inviteUrl}</p>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(inviteUrl)}
            className="mt-3 rounded-lg border border-teal-300 px-3 py-2 text-sm"
          >
            Скопировать ссылку
          </button>
          <p className="mt-3 text-xs text-slate-600">
            Пока ссылка показывается для локальной разработки; отправку email
            добавим отдельно.
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-medium">Активные клиенты</h2>

        {isLoading ? (
          <p className="mt-4 text-slate-500">Загружаем список…</p>
        ) : clients.length === 0 ? (
          <p className="mt-4 text-slate-500">
            Пока нет активных клиентов. Создай приглашение, чтобы начать.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {clients.map((relation) => {
              const name = [
                relation.client.profile?.firstName,
                relation.client.profile?.lastName,
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <li
                  key={relation.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="font-medium">{name || relation.client.email}</p>
                  {name && (
                    <p className="mt-1 text-sm text-slate-500">
                      {relation.client.email}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
