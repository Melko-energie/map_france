export default function Footer() {
  return (
    <footer className="border-t border-[var(--m-ink-08)] bg-[var(--m-ink-02)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--m-foret)]" aria-hidden="true" />
            <span className="font-display text-xl">
              Melko <span className="italic text-[var(--m-foret)]">Energie</span>
            </span>
          </div>
          <p className="font-display italic text-[var(--m-ink-70)] text-sm leading-relaxed">
            L'énergie au cœur des plus beaux projets — conseil CEE pour le tertiaire premium.
          </p>
        </div>
        <div>
          <h4 className="m-label mb-6">Observatoire</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors">Carte des refus</a></li>
            <li><a href="/#derniers-refus" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors">Derniers refus</a></li>
            <li><a href="/admin" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors">Espace Admin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="m-label mb-6">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="https://melko-energie.com" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors font-brand-mono text-xs">melko-energie.com</a></li>
            <li><span className="text-[var(--m-ink-70)]">Conseil CEE · Tertiaire premium</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 py-6 border-t border-[var(--m-ink-08)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--m-ink-50)] gap-2">
        <p>© 2026 Melko Energie Conseil. Tous droits réservés.</p>
        <p className="font-brand-mono uppercase tracking-widest text-[10px]">Observatoire des refus CEE</p>
      </div>
    </footer>
  )
}
