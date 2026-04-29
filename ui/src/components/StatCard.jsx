export default function StatCard({ label, value, subtitle, variant = 'light' }) {
  const base = variant === 'dark'
    ? 'bg-primary text-white'
    : 'bg-[var(--surface-container-low)]'

  return (
    <div className={`${base} p-8 rounded-xl flex flex-col justify-between h-48`}>
      <span className={`text-xs font-bold uppercase tracking-widest ${variant === 'dark' ? 'opacity-60' : 'text-secondary'}`}>
        {label}
      </span>
      <div className="space-y-1">
        <p className={`text-4xl font-headline ${variant === 'dark' ? '' : 'text-primary'}`}>{value}</p>
        <p className={`text-sm ${variant === 'dark' ? 'opacity-60' : 'text-[var(--on-surface-variant)]'}`}>{subtitle}</p>
      </div>
    </div>
  )
}
