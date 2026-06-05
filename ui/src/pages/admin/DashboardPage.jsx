import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../../lib/api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/api/departments').then(setData).catch((e) => setError(e.message))
  }, [])

  const stats = data?.stats

  return (
    <div className="space-y-10">
      <div>
        <div className="m-label mb-2">Tableau de bord</div>
        <h1 className="font-display text-4xl">
          Observatoire des <span className="italic text-[var(--m-foret)]">refus</span>
        </h1>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="m-card p-6">
          <div className="font-display text-5xl">{stats ? stats.totalRefusals : '—'}</div>
          <div className="m-label mt-3">Refus recensés</div>
        </div>
        <div className="m-card p-6">
          <div className="font-display text-5xl">{stats ? stats.departmentsAffected : '—'}</div>
          <div className="m-label mt-3">Départements concernés</div>
        </div>
        <div className="m-card p-6">
          <div className="font-display italic text-2xl leading-tight">{stats?.topMotif ?? '—'}</div>
          <div className="m-label mt-3">Motif le plus fréquent</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Derniers refus</h2>
          <Link to="/admin/refusals" className="m-btn text-xs !py-1.5 !px-4">Gérer les refus</Link>
        </div>
        <div className="m-card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="m-label">Date</th>
                <th className="m-label">Département</th>
                <th className="m-label">Type d'opération</th>
                <th className="m-label">Motif</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.latestRefusals ?? []).map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                  <td>{r.department.name} ({r.departmentCode})</td>
                  <td className="font-brand-mono text-xs text-[var(--m-saphir)]">{r.typeOperation}</td>
                  <td>{r.motif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
