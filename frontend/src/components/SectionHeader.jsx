export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-electric/80">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}