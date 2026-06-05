import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import Hero from '../components/Hero'
import { api } from '../lib/api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BreakdownCard({ title, entries }) {
  const sorted = Object.entries(entries).sort((a, b) => b[1] - a[1])
  return (
    <div className="m-card p-6">
      <h3 className="m-label mb-4">{title}</h3>
      {sorted.length === 0 && <p className="text-sm text-[var(--m-ink-50)] italic">Aucune donnée</p>}
      <ul className="space-y-2">
        {sorted.map(([label, count]) => (
          <li key={label} className="flex justify-between items-baseline gap-4 text-sm">
            <span className="text-[var(--m-ink-70)]">{label}</span>
            <span className="font-display text-xl shrink-0">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DepartmentPage() {
  const { id } = useParams()
  const [{ dept, error, fetchedId }, setState] = useState({ dept: null, error: null, fetchedId: null })

  useEffect(() => {
    let cancelled = false
    api(`/api/departments/${id}`)
      .then((data) => { if (!cancelled) setState({ dept: data, error: null, fetchedId: id }) })
      .catch((e) => { if (!cancelled) setState({ dept: null, error: e, fetchedId: id }) })
    return () => { cancelled = true }
  }, [id])

  const isLoading = fetchedId !== id

  if (isLoading) {
    return <div className="py-32 text-center text-[var(--m-ink-50)]">Chargement…</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-8">
        <span className="material-symbols-outlined text-6xl text-[var(--m-ink-30)] mb-4">error</span>
        <h1 className="font-display text-3xl mb-2">
          {error.status === 404 ? 'Département introuvable' : 'Erreur de chargement'}
        </h1>
        <p className="text-[var(--m-ink-70)] mb-8">{error.message}</p>
        <Link to="/" className="m-btn">Retour à la carte</Link>
      </div>
    )
  }

  if (!dept) {
    return <div className="py-32 text-center text-[var(--m-ink-50)]">Chargement…</div>
  }

  const hasContact = dept.contactName || dept.contactAddress || dept.contactPhone || dept.contactEmail

  return (
    <>
      <Hero
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Départements', href: '/' },
          { label: `${dept.name} (${dept.code})` },
        ]}
        eyebrow="Refus CEE"
        title={dept.name}
        subtitle={`${dept.stats.total} refus recensé${dept.stats.total > 1 ? 's' : ''}`}
        description={dept.note || undefined}
      />

      <section className="max-w-5xl mx-auto px-8 pb-24 space-y-12">
        {/* Répartitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BreakdownCard title="Refus par motif" entries={dept.stats.byMotif} />
          <BreakdownCard title="Refus par type d'opération" entries={dept.stats.byTypeOperation} />
        </div>

        {/* Liste des refus */}
        <div>
          <h2 className="font-display text-3xl mb-6">
            Détail des <span className="italic text-[var(--m-foret)]">refus</span>
          </h2>
          {dept.refusals.length === 0 ? (
            <p className="text-[var(--m-ink-50)] italic">Aucun refus enregistré pour ce département.</p>
          ) : (
            <div className="m-card overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="m-label">Date</th>
                    <th className="m-label">Motif</th>
                    <th className="m-label">Type d'opération</th>
                    <th className="m-label">Commentaire</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.refusals.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                      <td>{r.motif}</td>
                      <td className="font-brand-mono text-xs text-[var(--m-saphir)]">{r.typeOperation}</td>
                      <td className="text-[var(--m-ink-70)]">{r.commentaire || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact + actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasContact && (
            <div className="m-card p-6">
              <h3 className="m-label mb-4">Contact Melko</h3>
              {dept.contactName && <p className="font-display text-xl mb-2">{dept.contactName}</p>}
              {dept.contactAddress && <p className="text-sm text-[var(--m-ink-70)] whitespace-pre-line mb-2">{dept.contactAddress}</p>}
              {dept.contactPhone && <p className="text-sm font-brand-mono">{dept.contactPhone}</p>}
              {dept.contactEmail && <p className="text-sm font-brand-mono text-[var(--m-saphir)]">{dept.contactEmail}</p>}
            </div>
          )}
          {dept.news.length > 0 && (
            <div className="m-card p-6 space-y-5">
              <h3 className="m-label">Actualités</h3>
              {dept.news.map((n) => (
                <article key={n.id}>
                  <span className="font-brand-mono text-[10px] uppercase tracking-widest text-[var(--m-foret)]">{n.tag}</span>
                  <h4 className="font-display text-lg mt-1">{n.title}</h4>
                  <p className="text-sm text-[var(--m-ink-70)] leading-relaxed">{n.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
