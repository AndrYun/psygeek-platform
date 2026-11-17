'use client';

import { useEffect, useState } from 'react';
import { useDashboardUser } from '@/features/dashboard/model/dashboard-user-context';
import {
  createAppointment,
  getAppointments,
  type Appointment,
} from '@/features/appointments/api/appointments-api';
import {
  getClients,
  type ClientRelation,
} from '@/features/client-invites/api/client-invites-api';

function getName(
  profile: {
    firstName: string | null;
    lastName: string | null;
  } | null,
  email: string
) {
  const name = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ');

  return name || email;
}

export default function CalendarPage() {
  const user = useDashboardUser();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<ClientRelation[]>([]);
  const [clientId, setClientId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCalendar() {
      setIsLoading(true);
      setError('');

      try {
        const [appointmentResult, clientResult] = await Promise.all([
          getAppointments(),
          user.role === 'PSYCHOLOGIST' ? getClients() : Promise.resolve([]),
        ]);

        if (!cancelled) {
          setAppointments(appointmentResult);
          setClients(clientResult);

          if (clientResult.length > 0) {
            setClientId(clientResult[0].client.id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Не удалось загрузить календарь'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadCalendar();

    return () => {
      cancelled = true;
    };
  }, [user.role]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!clientId) {
      setError('Сначала нужен активный клиент.');
      return;
    }

    setIsCreating(true);

    try {
      const created = await createAppointment({
        clientId,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      });

      setAppointments((current) =>
        [...current, created].sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        )
      );

      setStartsAt('');
      setEndsAt('');
      setNotice('Встреча создана.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось создать встречу'
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section>
      <p className="mb-2 text-sm text-slate-500">Личный кабинет</p>
      <h1 className="text-3xl font-semibold">Календарь</h1>
      <p className="mt-2 text-slate-600">
        {user.role === 'PSYCHOLOGIST'
          ? 'Создавайте встречи и просматривайте расписание.'
          : 'Ваши запланированные встречи.'}
      </p>

      {user.role === 'PSYCHOLOGIST' && (
        <form
          onSubmit={handleCreate}
          className="mt-6 grid max-w-3xl gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
        >
          <label className="text-sm text-slate-600 sm:col-span-2">
            Клиент
            <select
              required
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              disabled={clients.length === 0}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
            >
              {clients.length === 0 ? (
                <option value="">Нет активных клиентов</option>
              ) : (
                clients.map((relation) => (
                  <option key={relation.client.id} value={relation.client.id}>
                    {getName(relation.client.profile, relation.client.email)}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Начало
            <input
              type="datetime-local"
              required
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3"
            />
          </label>

          <label className="text-sm text-slate-600">
            Окончание
            <input
              type="datetime-local"
              required
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3"
            />
          </label>

          <button
            type="submit"
            disabled={isCreating || clients.length === 0}
            className="rounded-xl bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50 sm:col-span-2"
          >
            {isCreating ? 'Создаём…' : 'Создать встречу'}
          </button>
        </form>
      )}

      {notice && (
        <p role="status" className="mt-4 text-sm text-teal-800">
          {notice}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-medium">Встречи</h2>

        {isLoading ? (
          <p className="mt-4 text-slate-500">Загружаем календарь…</p>
        ) : appointments.length === 0 ? (
          <p className="mt-4 text-slate-500">Пока встреч нет.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {appointments.map((appointment) => {
              const counterpart =
                user.role === 'PSYCHOLOGIST'
                  ? appointment.relation.client
                  : appointment.relation.psychologist;

              return (
                <li
                  key={appointment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="font-medium">
                    {new Date(appointment.startsAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    До {new Date(appointment.endsAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {user.role === 'PSYCHOLOGIST' ? 'Клиент: ' : 'Психолог: '}
                    {getName(counterpart.profile, counterpart.email)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Статус: {appointment.status}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
