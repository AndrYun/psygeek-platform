'use client';

import { useDashboardUser } from '@/features/dashboard/model/dashboard-user-context';

export default function DashboardPage() {
  const user = useDashboardUser();

  const isPsychologist = user.role === 'PSYCHOLOGIST';

  return (
    <section>
      <p className="mb-2 text-sm text-slate-500">Главная</p>
      <h1 className="mb-2 text-3xl font-semibold">
        {isPsychologist ? 'Рабочее пространство' : 'Ваше пространство'}
      </h1>
      <p className="mb-8 text-slate-600">
        Здесь будут ближайшие встречи, новые сообщения и актуальные задачи.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title={isPsychologist ? 'Встречи сегодня' : 'Следующая встреча'}
          description="Здесь появится информация о встречах."
        />
        <DashboardCard
          title={isPsychologist ? 'Мои клиенты' : 'Домашние задания'}
          description="Подключим реальные данные на следующих этапах."
        />
        <DashboardCard
          title="Сообщения"
          description="Здесь будут последние сообщения."
        />
      </div>
    </section>
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
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 font-medium">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </article>
  );
}
