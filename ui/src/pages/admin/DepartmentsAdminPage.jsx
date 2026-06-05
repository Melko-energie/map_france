import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

const EMPTY_NEWS = { tag: '', title: '', body: '' }

export default function DepartmentsAdminPage() {
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null) // detail of selected department
  const [error, setError] = useState(null)

  const [info, setInfo] = useState(null) // form note + contact
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoSaved, setInfoSaved] = useState(false)

  const [newsForm, setNewsForm] = useState(null) // null | { id?, tag, title, body }
  const [savingNews, setSavingNews] = useState(false)

  useEffect(() => {
    api('/api/departments').then((d) => setDepartments(d.departments)).catch((e) => setError(e.message))
  }, [])

  async function select(code) {
    setError(null)
    setNewsForm(null)
    setInfoSaved(false)
    try {
      const detail = await api(`/api/departments/${code}`)
      setSelected(detail)
      setInfo({
        note: detail.note || '',
        contactName: detail.contactName || '',
        contactAddress: detail.contactAddress || '',
        contactPhone: detail.contactPhone || '',
        contactEmail: detail.contactEmail || '',
      })
    } catch (e) {
      setError(e.message)
    }
  }

  async function saveInfo(e) {
    e.preventDefault()
    setSavingInfo(true)
    setInfoSaved(false)
    try {
      await api(`/api/departments/${selected.code}`, {
        method: 'PUT',
        body: {
          note: info.note || null,
          contactName: info.contactName || null,
          contactAddress: info.contactAddress || null,
          contactPhone: info.contactPhone || null,
          contactEmail: info.contactEmail || null,
        },
      })
      setInfoSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingInfo(false)
    }
  }

  async function saveNews(e) {
    e.preventDefault()
    setSavingNews(true)
    try {
      const body = { departmentCode: selected.code, tag: newsForm.tag, title: newsForm.title, body: newsForm.body }
      if (newsForm.id) {
        await api(`/api/news/${newsForm.id}`, { method: 'PUT', body })
      } else {
        await api('/api/news', { method: 'POST', body })
      }
      setNewsForm(null)
      select(selected.code)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingNews(false)
    }
  }

  async function removeNews(n) {
    if (!window.confirm(`Supprimer l'actualité « ${n.title} » ?`)) return
    try {
      await api(`/api/news/${n.id}`, { method: 'DELETE' })
      select(selected.code)
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = departments.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.startsWith(search)
  )

  return (
    <div className="space-y-8">
      <div>
        <div className="m-label mb-2">Gestion</div>
        <h1 className="font-display text-4xl">
          Les <span className="italic text-[var(--m-foret)]">départements</span>
        </h1>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Liste */}
        <div className="m-card p-4 space-y-2 lg:sticky lg:top-24">
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered input-sm w-full bg-[var(--m-papier)]"
          />
          <ul className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--m-ink-08)]">
            {filtered.map((d) => (
              <li key={d.code}>
                <button
                  onClick={() => select(d.code)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                    selected?.code === d.code
                      ? 'bg-[var(--m-foret)] text-[var(--m-papier)]'
                      : 'hover:bg-[var(--m-ink-05)]'
                  }`}
                >
                  <span>{d.code} — {d.name}</span>
                  {d.refusalCount > 0 && (
                    <span className="font-brand-mono text-xs opacity-70">{d.refusalCount}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Éditeur */}
        <div className="lg:col-span-2 space-y-6">
          {!selected && (
            <div className="m-card p-10 text-center text-[var(--m-ink-50)] italic">
              Sélectionnez un département pour modifier ses informations.
            </div>
          )}

          {selected && info && (
            <>
              <form onSubmit={saveInfo} className="m-card p-6 space-y-4">
                <h2 className="font-display text-2xl">
                  {selected.name} <span className="italic text-[var(--m-foret)]">({selected.code})</span>
                </h2>
                <div>
                  <label className="m-label block mb-2" htmlFor="d-note">Note (affichée sur la page publique)</label>
                  <textarea
                    id="d-note"
                    rows="3"
                    value={info.note}
                    onChange={(e) => setInfo({ ...info, note: e.target.value })}
                    className="textarea textarea-bordered w-full bg-[var(--m-papier)]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-cname">Nom du contact</label>
                    <input id="d-cname" type="text" value={info.contactName}
                      onChange={(e) => setInfo({ ...info, contactName: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-cphone">Téléphone</label>
                    <input id="d-cphone" type="text" value={info.contactPhone}
                      onChange={(e) => setInfo({ ...info, contactPhone: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-cmail">Email</label>
                    <input id="d-cmail" type="email" value={info.contactEmail}
                      onChange={(e) => setInfo({ ...info, contactEmail: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-caddr">Adresse</label>
                    <input id="d-caddr" type="text" value={info.contactAddress}
                      onChange={(e) => setInfo({ ...info, contactAddress: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  {infoSaved && <span className="text-sm text-[var(--m-foret)]">Enregistré ✓</span>}
                  <button type="submit" disabled={savingInfo} className="m-btn m-btn-foret">
                    {savingInfo ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </form>

              {/* Actualités */}
              <div className="m-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">Actualités</h3>
                  {!newsForm && (
                    <button onClick={() => setNewsForm({ ...EMPTY_NEWS })} className="m-btn text-xs !py-1.5 !px-4">
                      Ajouter
                    </button>
                  )}
                </div>

                {newsForm && (
                  <form onSubmit={saveNews} className="m-stage p-4 space-y-3">
                    <input
                      type="text" required placeholder="Tag (ex : Réglementation)"
                      value={newsForm.tag}
                      onChange={(e) => setNewsForm({ ...newsForm, tag: e.target.value })}
                      className="input input-bordered input-sm w-full bg-[var(--m-papier)]"
                    />
                    <input
                      type="text" required placeholder="Titre"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="input input-bordered input-sm w-full bg-[var(--m-papier)]"
                    />
                    <textarea
                      required rows="3" placeholder="Contenu"
                      value={newsForm.body}
                      onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })}
                      className="textarea textarea-bordered w-full bg-[var(--m-papier)]"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setNewsForm(null)} className="btn btn-ghost btn-sm">Annuler</button>
                      <button type="submit" disabled={savingNews} className="m-btn text-xs !py-1.5 !px-4">
                        {savingNews ? '…' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                )}

                {selected.news.length === 0 && !newsForm && (
                  <p className="text-sm text-[var(--m-ink-50)] italic">Aucune actualité.</p>
                )}
                <ul className="space-y-3">
                  {selected.news.map((n) => (
                    <li key={n.id} className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-brand-mono text-[10px] uppercase tracking-widest text-[var(--m-foret)]">{n.tag}</span>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-sm text-[var(--m-ink-70)]">{n.body}</p>
                      </div>
                      <div className="shrink-0">
                        <button
                          onClick={() => setNewsForm({ id: n.id, tag: n.tag, title: n.title, body: n.body })}
                          className="btn btn-ghost btn-xs" title="Modifier"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => removeNews(n)} className="btn btn-ghost btn-xs text-error" title="Supprimer">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
