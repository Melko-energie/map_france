export default function ContactCard({ name, address, icon = 'location_on' }) {
  return (
    <div className="flex gap-4">
      <span className="material-symbols-outlined text-secondary">{icon}</span>
      <div>
        <h4 className="font-bold text-primary">{name}</h4>
        <p className="text-[var(--on-surface-variant)] text-sm mt-1 leading-relaxed whitespace-pre-line">
          {address}
        </p>
      </div>
    </div>
  )
}
