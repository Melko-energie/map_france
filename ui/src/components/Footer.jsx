export default function Footer() {
  return (
    <footer className="bg-base-200 w-full border-t border-base-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 max-w-7xl mx-auto">
        <div className="md:col-span-1 space-y-6">
          <div className="font-headline font-black text-primary leading-tight">
            <p className="text-lg">RÉPUBLIQUE</p>
            <p className="text-lg">FRANÇAISE</p>
          </div>
          <p className="text-secondary text-sm italic">Liberté, Égalité, Fraternité</p>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-6 text-xs uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">Mentions Légales</a></li>
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">Accessibilité</a></li>
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">Données Personnelles</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-6 text-xs uppercase tracking-widest">Services</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">Contact</a></li>
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">Plan du site</a></li>
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">Aide et FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-6 text-xs uppercase tracking-widest">Partenaires</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">service-public.fr</a></li>
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">data.gouv.fr</a></li>
            <li><a href="#" className="text-secondary hover:text-accent transition-colors">impots.gouv.fr</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 py-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center text-xs text-secondary gap-4">
        <p>© 2024 Direction générale des Finances publiques. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Facebook</a>
          <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
