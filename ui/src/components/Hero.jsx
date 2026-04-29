export default function Hero({ breadcrumbs, title, subtitle, description, children, decorativeIcon }) {
  return (
    <header className="editorial-gradient py-20 lg:py-32 px-8 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {breadcrumbs && (
          <nav className="mb-8 flex items-center gap-2 text-[var(--primary-fixed-dim)] opacity-70 text-sm flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="material-symbols-outlined text-xs">chevron_right</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight animate-slide-up">
          {title}
        </h1>
        {subtitle && (
          <span className="block text-5xl md:text-7xl font-headline font-bold text-[var(--primary-fixed-dim)] italic mb-4 animate-slide-up">
            {subtitle}
          </span>
        )}
        {description && (
          <p className="text-lg text-slate-300 max-w-2xl font-light leading-relaxed mb-10">
            {description}
          </p>
        )}
        {children}
      </div>
      {decorativeIcon && (
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[30rem]">{decorativeIcon}</span>
        </div>
      )}
    </header>
  )
}
