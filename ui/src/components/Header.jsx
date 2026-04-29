import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 glass-nav shadow-sm">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold uppercase tracking-widest text-primary font-headline">
            République Française
          </Link>
          <nav className="hidden lg:flex items-center gap-8 ml-8">
            <a href="#" className="text-secondary hover:text-primary transition-colors duration-300 font-medium">Fiscalité</a>
            <a href="#" className="text-secondary hover:text-primary transition-colors duration-300 font-medium">Particuliers</a>
            <a href="#" className="text-secondary hover:text-primary transition-colors duration-300 font-medium">Entreprises</a>
            <a href="#" className="text-secondary hover:text-primary transition-colors duration-300 font-medium">Documentation</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Rechercher un service..."
              className="bg-base-200 border-none rounded-lg px-4 py-2 w-64 text-sm focus:ring-2 focus:ring-primary"
            />
            <span className="material-symbols-outlined absolute right-3 top-2 text-[var(--outline)]">search</span>
          </div>
          <button className="p-2 rounded-full hover:bg-base-200 transition-colors">
            <span className="material-symbols-outlined text-primary">language</span>
          </button>
          <button className="p-2 rounded-full hover:bg-base-200 transition-colors">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  )
}
