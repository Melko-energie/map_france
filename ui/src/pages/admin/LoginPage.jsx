import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { api } from '../../lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api('/api/auth/login', { method: 'POST', body: { email, password } })
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative z-[1]">
      <div className="m-card p-10 w-full max-w-sm">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <span className="w-7 h-7 rounded-full bg-[var(--m-foret)]" aria-hidden="true" />
          <span className="font-display text-2xl">
            Melko <span className="italic text-[var(--m-foret)]">Energie</span>
          </span>
        </Link>
        <div className="m-label text-center mb-8">Espace Administration</div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="m-label block mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-[var(--m-papier)]"
            />
          </div>
          <div>
            <label className="m-label block mb-2" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-[var(--m-papier)]"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="m-btn m-btn-foret w-full justify-center">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
