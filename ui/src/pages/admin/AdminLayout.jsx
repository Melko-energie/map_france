import { useEffect, useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router'
import { api } from '../../lib/api'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/refusals', label: 'Refus' },
  { to: '/admin/departments', label: 'Départements' },
]

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api('/api/auth/me')
      .then(setAdmin)
      .catch(() => navigate('/admin/login', { replace: true }))
  }, [navigate])

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' })
    navigate('/admin/login')
  }

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--m-ink-50)]">Chargement…</div>
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <header className="border-b border-[var(--m-ink-08)] bg-[#FAF8F4]/85 glass-nav sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--m-foret)]" aria-hidden="true" />
              <span className="font-display text-lg">
                Melko <span className="italic text-[var(--m-foret)]">Admin</span>
              </span>
            </Link>
            <nav className="flex items-center gap-5">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-[var(--m-foret)]' : 'text-[var(--m-ink-70)] hover:text-[var(--m-encre)]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-brand-mono text-xs text-[var(--m-ink-50)] hidden sm:inline">{admin.email}</span>
            <button onClick={logout} className="m-btn text-xs !py-1.5 !px-4">Déconnexion</button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  )
}
