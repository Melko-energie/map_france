import Hero from '../components/Hero'
import FranceMap from '../components/FranceMap'
import MapLegend from '../components/MapLegend'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Consultez votre Administration Fiscale par Département"
        description="Accédez en un clic aux services de proximité de la Direction Générale des Finances Publiques. Une interface simplifiée pour vos démarches territoriales."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-[var(--secondary-container)] text-[var(--on-secondary-container)] text-xs font-bold tracking-widest uppercase mb-6">
              Portail Officiel
            </span>
            <div className="flex flex-wrap gap-4 mt-6">
              <a href="#map" className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-base-200 transition-all flex items-center gap-2">
                Commencer l'exploration
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
              <button className="border border-white/20 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all">
                En savoir plus
              </button>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <span className="material-symbols-outlined text-[var(--secondary-fixed-dim)] text-4xl mb-4 block">account_balance</span>
                <h3 className="text-white font-bold text-lg mb-2">101 Préfectures</h3>
                <p className="text-[var(--primary-fixed-dim)] text-sm">Un maillage complet sur tout le territoire national.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 mt-12">
                <span className="material-symbols-outlined text-[var(--secondary-fixed-dim)] text-4xl mb-4 block">shield_with_heart</span>
                <h3 className="text-white font-bold text-lg mb-2">Sécurité Garantie</h3>
                <p className="text-[var(--primary-fixed-dim)] text-sm">Vos données sont protégées par l'État français.</p>
              </div>
            </div>
          </div>
        </div>
      </Hero>

      {/* Map Section */}
      <section id="map" className="bg-[var(--surface)] py-24 px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-headline text-4xl font-bold text-primary mb-4">Cartographie Interactive</h2>
          <p className="text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            Utilisez la carte ci-dessous pour localiser votre centre de fiscalité. Survolez un département pour obtenir les informations de contact immédiates.
          </p>
        </div>
        <div className="max-w-5xl mx-auto bg-[var(--surface-container-lowest)] p-8 lg:p-16 rounded-2xl shadow-sm relative">
          <div className="aspect-[4/3] w-full bg-[var(--surface-container-low)] rounded-xl flex items-center justify-center overflow-hidden relative group">
            <FranceMap />
            {/* Floating tooltip */}
            <div className="absolute bottom-8 right-8 bg-primary text-white p-6 rounded-xl shadow-xl max-w-xs transform transition-all group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[var(--secondary-fixed-dim)]">info</span>
                <div>
                  <p className="font-bold text-lg mb-1">Sélectionnez une zone</p>
                  <p className="text-sm text-[var(--primary-fixed-dim)]">Cliquez sur un département pour consulter les taux d'imposition locaux et les contacts administratifs.</p>
                </div>
              </div>
            </div>
          </div>
          <MapLegend />
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="bg-[var(--surface-container-low)] py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-8 bg-white p-10 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-headline text-3xl font-bold text-primary mb-6">Actualités Fiscales Territoriales</h3>
                <div className="space-y-6">
                  <div className="flex gap-6 items-start pb-6 border-b border-[var(--surface-container)]">
                    <div className="shrink-0 w-16 h-16 bg-[var(--secondary-container)] rounded-lg flex flex-col items-center justify-center text-[var(--on-secondary-container)] font-bold">
                      <span className="text-lg">15</span>
                      <span className="text-[10px] uppercase">Oct</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-primary hover:text-accent cursor-pointer transition-colors">Réforme de la taxe foncière 2024</h4>
                      <p className="text-secondary line-clamp-2">Les nouveaux barèmes applicables pour les propriétés bâties sont désormais consultables par région.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="shrink-0 w-16 h-16 bg-[var(--secondary-container)] rounded-lg flex flex-col items-center justify-center text-[var(--on-secondary-container)] font-bold">
                      <span className="text-lg">22</span>
                      <span className="text-[10px] uppercase">Sept</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-primary hover:text-accent cursor-pointer transition-colors">Digitalisation des services en zone rurale</h4>
                      <p className="text-secondary line-clamp-2">Ouverture de 15 nouveaux points France Services pour accompagner vos déclarations de revenus.</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-8 text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Voir toute l'actualité <span className="material-symbols-outlined">trending_flat</span>
              </button>
            </div>

            {/* Side Cards */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-accent p-8 rounded-2xl text-white">
                <span className="material-symbols-outlined text-4xl mb-4 block">verified_user</span>
                <h3 className="font-bold text-xl mb-2">Espace Professionnel</h3>
                <p className="text-[var(--tertiary-fixed)] text-sm mb-6 leading-relaxed">Gérez la fiscalité locale de votre entreprise avec nos outils dédiés.</p>
                <button className="w-full bg-white text-accent py-3 rounded-lg font-bold hover:bg-base-200 transition-all">
                  Se Connecter
                </button>
              </div>
              <div className="bg-primary p-8 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-4">Besoin d'aide ?</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-[var(--secondary-fixed-dim)]">phone_in_talk</span>
                    <span className="font-bold">0 809 401 401</span>
                  </div>
                  <p className="text-xs text-[var(--primary-fixed-dim)]">Service gratuit + prix appel. Disponible du lundi au vendredi de 8h30 à 19h.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto text-center bg-[var(--surface-container-lowest)] border-2 border-primary/5 p-16 rounded-[2rem] shadow-xl">
          <h2 className="font-headline text-4xl font-black text-primary mb-6 italic">L'excellence de l'administration au service du territoire.</h2>
          <p className="text-secondary text-lg mb-10 max-w-2xl mx-auto">
            Inscrivez-vous à notre lettre d'information pour rester informé des évolutions fiscales de votre département.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-grow bg-[var(--surface-container-low)] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-[var(--primary-container)] transition-all">
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
