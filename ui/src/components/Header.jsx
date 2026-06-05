import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#FAF8F4]/85 glass-nav border-b border-[var(--m-ink-08)]">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[var(--m-foret)] shadow-sm" aria-hidden="true" />
          <span className="font-display text-2xl tracking-tight">
            Melko <span className="italic text-[var(--m-foret)]">Energie</span>
          </span>
          <span className="m-label mt-1 hidden sm:inline">Conseil</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hidden md:inline text-sm font-medium text-[var(--m-ink-70)] hover:text-[var(--m-encre)] transition-colors">
            Carte des refus
          </Link>
          <a href="/#derniers-refus" className="hidden md:inline text-sm font-medium text-[var(--m-ink-70)] hover:text-[var(--m-encre)] transition-colors">
            Derniers refus
          </a>
          <Link to="/admin" className="m-btn text-sm !py-2 !px-5">
            Espace Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
