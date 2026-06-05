import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Hero from '../components/Hero'
import FranceMap from '../components/FranceMap'
import MapLegend from '../components/MapLegend'
import { api } from '../lib/api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function HomePage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/api/departments').then(setData).catch((e) => setError(e.message))
  }, [])

  const counts = {}
  if (data) for (const d of data.departments) counts[d.code] = d.refusalCount
  const max = Math.max(0, ...Object.values(counts))
  const stats = data?.stats

  return (
    <>
      <Hero
        eyebrow="Observatoire CEE"
        title="Les refus de l'administration,"
        subtitle="département par département"
        description="Melko Energie Conseil cartographie les refus de dossiers CEE notifiés par l'administration. Cliquez sur un département pour le détail des motifs et des opérations concernées."
      >
        <div className="flex justify-center mt-8">
          <a href="#map" className="m-btn">
            Explorer la carte
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </a>
        </div>
      </Hero>

      {error && (
        <div className="max-w-3xl mx-auto px-8 mb-8">
          <div className="m-card p-4 text-sm text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            Impossible de charger les données ({error}). Vérifiez que l'API est démarrée (server/, port 3001).
          </div>
        </div>
      )}

      {/* Carte */}
      <section id="map" className="py-12 px-8">
        <div className="max-w-5xl mx-auto m-card m-card-hover p-8 lg:p-14">
          <div className="m-stage p-6">
            <FranceMap counts={counts} />
          </div>
          <MapLegend max={max} />
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="m-card m-card-hover p-6">
            <div className="font-display text-5xl">{stats ? stats.totalRefusals : '—'}</div>
            <div className="m-label mt-3">Refus recensés</div>
          </div>
          <div className="m-card m-card-hover p-6">
            <div className="font-display text-5xl">{stats ? stats.departmentsAffected : '—'}</div>
            <div className="m-label mt-3">Départements concernés</div>
          </div>
          <div className="m-card m-card-hover p-6">
            <div className="font-display italic text-2xl leading-tight">{stats?.topMotif ?? '—'}</div>
            <div className="m-label mt-3">Motif le plus fréquent</div>
          </div>
        </div>
      </section>

      {/* Derniers refus */}
      <section id="derniers-refus" className="py-12 px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl mb-8">
            Derniers <span className="italic text-[var(--m-foret)]">refus</span> enregistrés
          </h2>
          <div className="space-y-3">
            {(stats?.latestRefusals ?? []).map((r) => (
              <Link
                key={r.id}
                to={`/department/${r.departmentCode}`}
                className="m-card m-card-hover p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6"
              >
                <span className="m-label shrink-0 w-32">{formatDate(r.date)}</span>
                <span className="font-medium shrink-0 md:w-44">{r.department.name} ({r.departmentCode})</span>
                <span className="font-brand-mono text-xs text-[var(--m-saphir)] shrink-0">{r.typeOperation}</span>
                <span className="text-[var(--m-ink-70)] text-sm">{r.motif}</span>
              </Link>
            ))}
            {stats && stats.latestRefusals.length === 0 && (
              <p className="text-[var(--m-ink-50)] italic">Aucun refus enregistré pour le moment.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
