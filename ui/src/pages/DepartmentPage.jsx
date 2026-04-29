import { useParams, Link } from 'react-router'
import { getDepartment } from '../data/departments'
import Hero from '../components/Hero'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import ContactCard from '../components/ContactCard'
import NewsCard from '../components/NewsCard'

export default function DepartmentPage() {
  const { id } = useParams()
  const dept = getDepartment(id)

  if (!dept) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="material-symbols-outlined text-6xl text-secondary mb-4">error</span>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Département introuvable</h1>
        <p className="text-secondary mb-8">Le département « {id} » n'existe pas.</p>
        <Link to="/" className="btn btn-primary">Retour à la carte</Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Directions Départementales', href: '/' },
    { label: `${dept.name} (${dept.id})` },
  ]

  const quickLinks = [
    { icon: 'mail', label: 'Nous contacter' },
    { icon: 'calendar_month', label: 'Prendre RDV' },
    { icon: 'map', label: 'Carte des centres' },
  ]

  return (
    <>
      <Hero
        breadcrumbs={breadcrumbs}
        title="Administration Fiscale"
        subtitle={`de la ${dept.name}`}
        description={`Direction départementale des Finances publiques (DDFiP) de la ${dept.name} au service des citoyens et du développement économique régional.`}
        decorativeIcon="account_balance"
      />

      <section className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Sidebar
          director={dept.director}
          secretariat={dept.secretariat}
          quickLinks={quickLinks}
          alert={dept.alert}
        />

        <div className="lg:col-span-9 space-y-20">
          {/* Stats */}
          <section>
            <h2 className="text-3xl font-bold text-primary mb-8 border-l-4 border-accent pl-6">Indicateurs de la Région</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Contribuables" value={dept.stats.taxpayers} subtitle={dept.stats.taxpayersSubtitle} />
              <StatCard label="Recouvrement Annuel" value={dept.stats.collection} subtitle={dept.stats.collectionSubtitle} variant="dark" />
              <StatCard label="Taux de Satisfaction" value={dept.stats.satisfaction} subtitle={dept.stats.satisfactionSubtitle} />
            </div>
          </section>

          {/* Contacts & Hours */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-8">Centres de Contact Principaux</h2>
              <div className="space-y-8">
                {dept.contacts.map((contact, i) => (
                  <ContactCard key={i} name={contact.name} address={contact.address} />
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-6">Horaires d'Ouverture</h2>
              <ul className="space-y-4 text-sm">
                {dept.hours.map((h, i) => (
                  <li key={i} className={`flex justify-between pb-2 ${i < dept.hours.length - 1 ? 'border-b border-[var(--outline-variant)]/10' : ''} ${h.isError ? 'text-error font-medium' : ''}`}>
                    <span className={h.isError ? '' : 'text-secondary'}>{h.label}</span>
                    <span className="font-bold">{h.value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-[var(--on-surface-variant)] italic leading-relaxed">
                * Les horaires peuvent varier durant les périodes de congés scolaires et jours fériés.
              </p>
            </div>
          </section>

          {/* News */}
          {dept.news.length > 0 && (
            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold text-primary">Actualités Fiscales {dept.id}</h2>
                <a href="#" className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
                  Toute l'actualité <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dept.news.map((article, i) => (
                  <NewsCard key={i} tag={article.tag} title={article.title} excerpt={article.excerpt} image={article.image} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  )
}
