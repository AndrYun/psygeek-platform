export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <section className="max-w-3xl text-center">
        <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          PsyGeek Platform
        </div>

        <h1 className="mb-6 text-5xl font-semibold tracking-tight">
          Платформа для психологов и клиентов
        </h1>

        <p className="mb-10 text-lg text-neutral-400">
          Личный кабинет, встречи, чат, домашние задания и безопасная работа с
          клиентами.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="rounded-xl bg-blue-500 px-6 py-3 font-medium transition hover:bg-blue-400"
          >
            Войти
          </a>

          <a
            href="/register"
            className="rounded-xl border border-white/10 px-6 py-3 font-medium transition hover:bg-white/10"
          >
            Регистрация
          </a>
        </div>
      </section>
    </main>
  );
}
