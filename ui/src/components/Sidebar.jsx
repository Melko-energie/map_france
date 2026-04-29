export default function Sidebar({ director, secretariat, quickLinks, alert }) {
  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-12">
      <nav className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)] mb-6">Direction</h3>
        <div className="group cursor-pointer p-4 -mx-4 rounded hover:bg-[var(--surface-container-low)] transition-all">
          <p className="text-xs text-secondary font-semibold mb-1">Directeur Départemental</p>
          <p className="text-primary font-bold">{director}</p>
        </div>
        {secretariat && (
          <div className="group cursor-pointer p-4 -mx-4 rounded hover:bg-[var(--surface-container-low)] transition-all">
            <p className="text-xs text-secondary font-semibold mb-1">Secrétariat Général</p>
            <p className="text-primary font-bold">{secretariat}</p>
          </div>
        )}
      </nav>

      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Services Directs</h3>
        <ul className="space-y-4">
          {quickLinks.map((link, i) => (
            <li key={i}>
              <a href={link.href || '#'} className="flex items-center gap-3 text-[var(--on-surface)] hover:text-primary group">
                <span className="w-8 h-8 flex items-center justify-center rounded bg-[var(--secondary-container)] text-primary material-symbols-outlined">
                  {link.icon}
                </span>
                <span className="font-medium">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {alert && (
        <div className="bg-[var(--tertiary-container)] text-[var(--tertiary-fixed)] p-6 rounded-lg">
          <span className="material-symbols-outlined mb-4 block">warning</span>
          <h4 className="font-bold mb-2">{alert.title}</h4>
          <p className="text-sm opacity-80 leading-relaxed">{alert.message}</p>
        </div>
      )}
    </aside>
  )
}
