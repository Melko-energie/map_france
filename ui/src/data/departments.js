const DEPARTMENT_NAMES = {
  '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
  '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
  '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
  '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
  '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '2A': 'Corse-du-Sud',
  '2B': 'Haute-Corse', '21': 'Côte-d\'Or', '22': 'Côtes-d\'Armor', '23': 'Creuse',
  '24': 'Dordogne', '25': 'Doubs', '26': 'Drôme', '27': 'Eure',
  '28': 'Eure-et-Loir', '29': 'Finistère', '30': 'Gard', '31': 'Haute-Garonne',
  '32': 'Gers', '33': 'Gironde', '34': 'Hérault', '35': 'Ille-et-Vilaine',
  '36': 'Indre', '37': 'Indre-et-Loire', '38': 'Isère', '39': 'Jura',
  '40': 'Landes', '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire',
  '44': 'Loire-Atlantique', '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne',
  '48': 'Lozère', '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne',
  '52': 'Haute-Marne', '53': 'Mayenne', '54': 'Meurthe-et-Moselle', '55': 'Meuse',
  '56': 'Morbihan', '57': 'Moselle', '58': 'Nièvre', '59': 'Nord',
  '60': 'Oise', '61': 'Orne', '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme',
  '64': 'Pyrénées-Atlantiques', '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales',
  '67': 'Bas-Rhin', '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône',
  '71': 'Saône-et-Loire', '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie',
  '75': 'Paris', '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines',
  '79': 'Deux-Sèvres', '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne',
  '83': 'Var', '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne',
  '87': 'Haute-Vienne', '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort',
  '91': 'Essonne', '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne', '95': 'Val-d\'Oise',
  '971': 'Guadeloupe', '972': 'Martinique', '973': 'Guyane',
  '974': 'La Réunion', '976': 'Mayotte',
}

const DETAILED_DATA = {
  '31': {
    director: 'Jean-Marc Vallet',
    secretariat: 'Cabinet de Direction',
    stats: {
      taxpayers: '845,210',
      taxpayersSubtitle: 'Foyers fiscaux actifs',
      collection: '€4.2B',
      collectionSubtitle: 'Contribution territoriale',
      satisfaction: '92%',
      satisfactionSubtitle: 'Accueil et accompagnement',
    },
    contacts: [
      { name: 'Cité Administrative de Toulouse', address: 'Bâtiment C, Boulevard Armand Duportal\n31000 Toulouse' },
      { name: 'SIP Muret', address: '15, Avenue Vincent Auriol\n31600 Muret' },
    ],
    hours: [
      { label: 'Lundi — Vendredi', value: '08:30 – 12:00' },
      { label: 'Après-midi (Sur RDV uniquement)', value: '13:30 – 16:00' },
      { label: 'Samedi & Dimanche', value: 'Fermé', isError: true },
    ],
    news: [
      {
        tag: 'Fiscalité locale',
        title: 'Révision des valeurs locatives en Haute-Garonne pour 2024',
        excerpt: 'Les nouvelles directives concernant la taxe foncière ont été publiées pour les communes de la première couronne toulousaine.',
      },
      {
        tag: 'Accompagnement',
        title: "Ouverture d'une nouvelle Maison France Services à Revel",
        excerpt: "Un nouveau point d'accueil pour accompagner les contribuables dans leurs démarches numériques en zone rurale.",
      },
    ],
    alert: {
      title: 'Période de déclaration',
      message: 'Le service de déclaration en ligne est actuellement ouvert pour la Haute-Garonne jusqu\'au 8 juin.',
    },
  },
}

function generateDefaults(id) {
  return {
    director: 'Direction Départementale',
    secretariat: 'Cabinet de Direction',
    stats: {
      taxpayers: '—',
      taxpayersSubtitle: 'Foyers fiscaux actifs',
      collection: '—',
      collectionSubtitle: 'Contribution territoriale',
      satisfaction: '—',
      satisfactionSubtitle: 'Accueil et accompagnement',
    },
    contacts: [
      { name: 'Centre des Finances Publiques', address: `Département ${id}` },
    ],
    hours: [
      { label: 'Lundi — Vendredi', value: '08:30 – 12:00' },
      { label: 'Après-midi (Sur RDV uniquement)', value: '13:30 – 16:00' },
      { label: 'Samedi & Dimanche', value: 'Fermé', isError: true },
    ],
    news: [],
    alert: null,
  }
}

export function getDepartment(id) {
  const name = DEPARTMENT_NAMES[id]
  if (!name) return null
  const data = DETAILED_DATA[id] || generateDefaults(id)
  return { id, name, ...data }
}

export function getDepartmentName(id) {
  return DEPARTMENT_NAMES[id] || null
}

export { DEPARTMENT_NAMES }
