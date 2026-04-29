export default function NewsCard({ image, tag, title, excerpt }) {
  return (
    <article className="group cursor-pointer">
      <div className="news-image-zoom overflow-hidden rounded-lg mb-4 h-64 bg-base-300">
        {image && (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        )}
      </div>
      <span className="text-xs font-bold text-accent uppercase tracking-widest">{tag}</span>
      <h3 className="text-xl font-bold text-primary mt-2 group-hover:underline">{title}</h3>
      <p className="text-[var(--on-surface-variant)] text-sm mt-3 leading-relaxed">{excerpt}</p>
    </article>
  )
}
