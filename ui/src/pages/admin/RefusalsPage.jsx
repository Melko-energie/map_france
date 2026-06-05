import { useCallback, useEffect, useState } from 'react'
import { api } from '../../lib/api'

const EMPTY_FORM = { departmentCode: '', date: '', motif: '', typeOperation: '', commentaire: '' }

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function toInputDate(iso) {
  return new Date(iso).toISOString().slice(0, 10)
}

export default function RefusalsPage() {
  const [departments, setDepartments] = useState([])
  const [list, setList] = useState({ items: [], total: 0, page: 1, pageSize: 20 })
  const [filterDept, setFilterDept] = useState('')
  const [filterMotif, setFilterMotif] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)

  // null = modal fermé ; { id?, ...form } = création ou édition
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    api('/api/departments').then((d) => setDepartments(d.departments)).catch((e) => setError(e.message))
  }, [])

  const load = useCallback(() => {
    const params = new URLSearchParams()
    if (filterDept) params.set('department', filterDept)
    if (filterMotif) params.set('motif', filterMotif)
    params.set('page', String(page))
    api(`/api/refusals?${params}`).then(setList).catch((e) => setError(e.message))
  }, [filterDept, filterMotif, page])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setFormError(null)
    setEditing({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
  }

  function openEdit(r) {
    setFormError(null)
    setEditing({
      id: r.id,
      departmentCode: r.departmentCode,
      date: toInputDate(r.date),
      motif: r.motif,
      typeOperation: r.typeOperation,
      commentaire: r.commentaire || '',
    })
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const body = {
      departmentCode: editing.departmentCode,
      date: editing.date,
      motif: editing.motif,
      typeOperation: editing.typeOperation,
      commentaire: editing.commentaire || null,
    }
    try {
      if (editing.id) {
        await api(`/api/refusals/${editing.id}`, { method: 'PUT', body })
      } else {
        await api('/api/refusals', { method: 'POST', body })
      }
      setEditing(null)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(r) {
    if (!window.confirm(`Supprimer le refus du ${formatDate(r.date)} (${r.department.name}) ?`)) return
    try {
      await api(`/api/refusals/${r.id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const totalPages = Math.max(1, Math.ceil(list.total / list.pageSize))

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="m-label mb-2">Gestion</div>
          <h1 className="font-display text-4xl">
            Les <span className="italic text-[var(--m-foret)]">refus</span>
          </h1>
        </div>
        <button onClick={openCreate} className="m-btn m-btn-foret">
          <span className="material-symbols-outlined text-base">add</span>
          Ajouter un refus
        </button>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterDept}
          onChange={(e) => { setPage(1); setFilterDept(e.target.value) }}
          className="select select-bordered bg-[var(--m-papier)]"
        >
          <option value="">Tous les départements</option>
          {departments.map((d) => (
            <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrer par motif…"
          value={filterMotif}
          onChange={(e) => { setPage(1); setFilterMotif(e.target.value) }}
          className="input input-bordered bg-[var(--m-papier)] w-64"
        />
      </div>

      {/* Tableau */}
      <div className="m-card overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="m-label">Date</th>
              <th className="m-label">Département</th>
              <th className="m-label">Motif</th>
              <th className="m-label">Type d'opération</th>
              <th className="m-label">Commentaire</th>
              <th className="m-label text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                <td className="whitespace-nowrap">{r.department.name} ({r.departmentCode})</td>
                <td>{r.motif}</td>
                <td className="font-brand-mono text-xs text-[var(--m-saphir)]">{r.typeOperation}</td>
                <td className="text-[var(--m-ink-70)] max-w-xs truncate">{r.commentaire || '—'}</td>
                <td className="text-right whitespace-nowrap">
                  <button onClick={() => openEdit(r)} className="btn btn-ghost btn-xs" title="Modifier">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button onClick={() => remove(r)} className="btn btn-ghost btn-xs text-error" title="Supprimer">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {list.items.length === 0 && (
              <tr><td colSpan="6" className="text-center text-[var(--m-ink-50)] italic py-8">Aucun refus</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-ghost btn-sm">←</button>
          <span className="font-brand-mono text-xs">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-ghost btn-sm">→</button>
        </div>
      )}

      {/* Modal création / édition */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--m-ink-50)] p-4">
          <form onSubmit={save} className="m-card !bg-[var(--m-papier)] p-8 w-full max-w-lg space-y-4">
            <h2 className="font-display text-2xl mb-2">
              {editing.id ? 'Modifier le refus' : 'Nouveau refus'}
            </h2>
            <div>
              <label className="m-label block mb-2" htmlFor="f-dept">Département</label>
              <select
                id="f-dept"
                required
                value={editing.departmentCode}
                onChange={(e) => setEditing({ ...editing, departmentCode: e.target.value })}
                className="select select-bordered w-full bg-[var(--m-papier)]"
              >
                <option value="" disabled>Choisir…</option>
                {departments.map((d) => (
                  <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-date">Date du refus</label>
              <input
                id="f-date"
                type="date"
                required
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="input input-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-motif">Motif du refus</label>
              <input
                id="f-motif"
                type="text"
                required
                value={editing.motif}
                onChange={(e) => setEditing({ ...editing, motif: e.target.value })}
                className="input input-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-type">Type d'opération</label>
              <input
                id="f-type"
                type="text"
                required
                placeholder="ex : BAR-TH-171"
                value={editing.typeOperation}
                onChange={(e) => setEditing({ ...editing, typeOperation: e.target.value })}
                className="input input-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-comment">Commentaire (optionnel)</label>
              <textarea
                id="f-comment"
                rows="3"
                value={editing.commentaire}
                onChange={(e) => setEditing({ ...editing, commentaire: e.target.value })}
                className="textarea textarea-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            {formError && <p className="text-error text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost">Annuler</button>
              <button type="submit" disabled={saving} className="m-btn m-btn-foret">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
