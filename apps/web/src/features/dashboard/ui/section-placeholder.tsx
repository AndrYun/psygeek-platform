export function SectionPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section>
      <p className="mb-2 text-sm text-slate-500">Личный кабинет</p>
      <h1 className="mb-2 text-3xl font-semibold">{title}</h1>
      <p className="text-slate-600">{description}</p>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-sm text-slate-500">
        Раздел подготовлен. Подключим данные и функциональность позже.
      </div>
    </section>
  );
}
