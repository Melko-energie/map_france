import { CHORO_SCALE, CHORO_ZERO } from '../lib/choropleth'

export default function MapLegend({ max = 0 }) {
  const buckets = [{ color: CHORO_ZERO, label: 'Aucun refus' }]
  if (max > 0) {
    const step = max / CHORO_SCALE.length
    CHORO_SCALE.forEach((color, i) => {
      const from = Math.floor(i * step) + 1
      const to = i === CHORO_SCALE.length - 1 ? max : Math.floor((i + 1) * step)
      if (to >= from) {
        buckets.push({ color, label: from === to ? `${from} refus` : `${from} – ${to} refus` })
      }
    })
  }

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-[var(--m-ink-08)] pt-8">
      {buckets.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full shadow-[inset_0_0_0_0.5px_var(--m-ink-12)]"
            style={{ background: item.color }}
          />
          <span className="text-sm text-[var(--m-ink-70)]">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
