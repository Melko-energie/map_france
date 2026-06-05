export default function Hero({ breadcrumbs, eyebrow, title, subtitle, description, children }) {
  return (
    <header className="py-16 lg:py-24 px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {breadcrumbs && (
          <nav className="mb-8 flex items-center justify-center gap-2 text-[var(--m-ink-50)] text-sm flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="material-symbols-outlined text-xs">chevron_right</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-[var(--m-encre)] transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-[var(--m-encre)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="m-label mb-4">{eyebrow}</div>}
        <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-none animate-slide-up">
          {title}
        </h1>
        {subtitle && (
          <span className="block font-display italic text-4xl md:text-5xl text-[var(--m-foret)] mt-2 animate-slide-up">
            {subtitle}
          </span>
        )}
        {description && (
          <p className="text-base text-[var(--m-ink-70)] max-w-2xl mx-auto leading-relaxed mt-6">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
