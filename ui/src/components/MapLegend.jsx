const LEGEND_ITEMS = [
  { color: 'bg-primary', label: 'Siège Régional' },
  { color: 'bg-secondary', label: 'Antenne Départementale' },
  { color: 'bg-accent', label: 'Trésorerie Spécialisée' },
  { color: 'bg-[var(--outline-variant)]', label: "Zone d'Expérimentation" },
]

export default function MapLegend() {
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--outline-variant)]/20 pt-8">
      {LEGEND_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-4 h-4 ${item.color} rounded-full`} />
          <span className="text-sm font-medium text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
