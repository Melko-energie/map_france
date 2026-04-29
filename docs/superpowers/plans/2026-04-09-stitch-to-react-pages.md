# Stitch → React Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the stitch HTML pages into the React 19 + Vite UI project with Tailwind CSS v4, DaisyUI, React Router, and a custom Statelier theme.

**Architecture:** Component-first approach — shared layout components (Header, Footer, Hero) built first, then composed into two page routes: HomePage (interactive France map) and DepartmentPage (department details). All Material Design 3 color tokens from the stitch design system are mapped to a custom DaisyUI theme.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, DaisyUI, React Router v7, Google Fonts (Noto Serif, Public Sans, Material Symbols Outlined)

---

### Task 1: Install dependencies and configure Tailwind + DaisyUI

**Files:**
- Modify: `ui/package.json`
- Modify: `ui/index.html`
- Modify: `ui/src/index.css`
- Modify: `ui/vite.config.js`

- [ ] **Step 1: Install Tailwind CSS v4, DaisyUI, and React Router**

Run from `ui/` directory:
```bash
npm install tailwindcss @tailwindcss/vite daisyui react-router
```

- [ ] **Step 2: Configure Vite to use Tailwind CSS plugin**

Replace `ui/vite.config.js` with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Replace index.css with Tailwind directives and custom DaisyUI theme**

Replace `ui/src/index.css` with:
```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: statelier --default;
}

@theme {
  --font-headline: 'Noto Serif', serif;
  --font-body: 'Public Sans', sans-serif;
  --font-label: 'Public Sans', sans-serif;
}

@plugin "daisyui/theme" {
  name: "statelier";
  default: true;
  color-scheme: light;
  --color-base-100: #ffffff;
  --color-base-200: #f3f4f5;
  --color-base-300: #e8eaec;
  --color-base-content: #191c1d;
  --color-primary: #000d2c;
  --color-primary-content: #ffffff;
  --color-secondary: #48626e;
  --color-secondary-content: #ffffff;
  --color-accent: #280006;
  --color-accent-content: #ffffff;
  --color-neutral: #44464f;
  --color-neutral-content: #f0f1f2;
  --color-info: #455d95;
  --color-info-content: #d9e2ff;
  --color-error: #ba1a1a;
  --color-error-content: #ffffff;
  --radius-btn: 0.375rem;
  --radius-box: 0.5rem;
  --radius-field: 0.25rem;
}

/* Extended design tokens from stitch */
:root {
  --primary-container: #002157;
  --on-primary-container: #738ac6;
  --primary-fixed-dim: #b0c6ff;
  --secondary-container: #cbe7f5;
  --on-secondary-container: #4e6874;
  --tertiary-container: #500014;
  --on-tertiary-container: #e55e6f;
  --tertiary-fixed: #ffdadb;
  --tertiary-fixed-dim: #ffb2b7;
  --secondary-fixed: #cbe7f5;
  --secondary-fixed-dim: #afcbd8;
  --surface: #f8f9fa;
  --surface-container: #edeeef;
  --surface-container-low: #f3f4f5;
  --surface-container-lowest: #ffffff;
  --surface-container-high: #e7e8e9;
  --surface-container-highest: #e1e3e4;
  --on-surface: #191c1d;
  --on-surface-variant: #44464f;
  --outline: #757781;
  --outline-variant: #c4c6d1;
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Statelier interaction patterns */
.editorial-gradient {
  background: linear-gradient(135deg, #000d2c 0%, #002157 100%);
}

.glass-nav {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Map department interaction */
.map-department {
  transition: fill 0.2s ease;
  cursor: pointer;
}
.map-department:hover {
  fill: #280006;
}

/* News card image hover */
.news-image-zoom:hover img {
  transform: scale(1.05);
}
.news-image-zoom img {
  transition: transform 500ms ease;
}

/* Slide-up fade-in animation */
@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUpFadeIn 300ms ease-out forwards;
}

body {
  font-family: 'Public Sans', sans-serif;
  margin: 0;
}

h1, h2, h3 {
  font-family: 'Noto Serif', serif;
}
```

- [ ] **Step 4: Add Google Fonts to index.html**

Replace the `<head>` section of `ui/index.html` with:
```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portail de la Fiscalité Territoriale - République Française</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;0,900;1,400&family=Public+Sans:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Delete old App.css**

Remove `ui/src/App.css` — all styling is now via Tailwind.

- [ ] **Step 6: Verify build works**

```bash
cd ui && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js src/index.css index.html
git rm src/App.css
git commit -m "feat: add Tailwind CSS v4, DaisyUI, React Router with Statelier theme"
```

---

### Task 2: Set up React Router and root layout

**Files:**
- Create: `ui/src/router.jsx`
- Modify: `ui/src/App.jsx`
- Modify: `ui/src/main.jsx`
- Create: `ui/src/pages/HomePage.jsx`
- Create: `ui/src/pages/DepartmentPage.jsx`

- [ ] **Step 1: Create placeholder page components**

Create `ui/src/pages/HomePage.jsx`:
```jsx
export default function HomePage() {
  return <div className="p-8">HomePage placeholder</div>
}
```

Create `ui/src/pages/DepartmentPage.jsx`:
```jsx
import { useParams } from 'react-router'

export default function DepartmentPage() {
  const { id } = useParams()
  return <div className="p-8">DepartmentPage for department {id}</div>
}
```

- [ ] **Step 2: Create router configuration**

Create `ui/src/router.jsx`:
```jsx
import { createBrowserRouter } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import DepartmentPage from './pages/DepartmentPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'department/:id', element: <DepartmentPage /> },
    ],
  },
])

export default router
```

- [ ] **Step 3: Update App.jsx to be the root layout**

Replace `ui/src/App.jsx` with:
```jsx
import { Outlet } from 'react-router'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] font-body">
      {/* Header and Footer will be added in later tasks */}
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 4: Update main.jsx to use RouterProvider**

Replace `ui/src/main.jsx` with:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

- [ ] **Step 5: Verify routing works**

```bash
cd ui && npm run dev
```

Open browser: `http://localhost:5173/` should show "HomePage placeholder". Navigate to `http://localhost:5173/department/31` should show "DepartmentPage for department 31".

- [ ] **Step 6: Commit**

```bash
git add src/router.jsx src/pages/HomePage.jsx src/pages/DepartmentPage.jsx src/App.jsx src/main.jsx
git commit -m "feat: set up React Router with root layout and placeholder pages"
```

---

### Task 3: Build Header component

**Files:**
- Create: `ui/src/components/Header.jsx`
- Modify: `ui/src/App.jsx`

- [ ] **Step 1: Create Header component**

Create `ui/src/components/Header.jsx`:
```jsx
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
```

- [ ] **Step 2: Add Header to App.jsx layout**

Replace `ui/src/App.jsx` with:
```jsx
import { Outlet } from 'react-router'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)]">
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Verify Header renders**

```bash
cd ui && npm run dev
```

Expected: Fixed header with glass effect, branding, nav links, search input visible at top.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.jsx src/App.jsx
git commit -m "feat: add Header component with glass-nav effect"
```

---

### Task 4: Build Footer component

**Files:**
- Create: `ui/src/components/Footer.jsx`
- Modify: `ui/src/App.jsx`

- [ ] **Step 1: Create Footer component**

Create `ui/src/components/Footer.jsx`:
```jsx
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
```

- [ ] **Step 2: Add Footer to App.jsx layout**

Replace `ui/src/App.jsx` with:
```jsx
import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col">
      <Header />
      <main className="pt-20 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Verify Footer renders**

```bash
cd ui && npm run dev
```

Expected: 4-column footer with branding, links, copyright visible at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.jsx src/App.jsx
git commit -m "feat: add Footer component with 4-column layout"
```

---

### Task 5: Build Hero component

**Files:**
- Create: `ui/src/components/Hero.jsx`

- [ ] **Step 1: Create reusable Hero component**

Create `ui/src/components/Hero.jsx`:
```jsx
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
```

- [ ] **Step 2: Verify component exports cleanly**

```bash
cd ui && npm run build
```

Expected: Build succeeds (component is not yet used in a page, but should compile).

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: add reusable Hero component with editorial gradient"
```

---

### Task 6: Build StatCard, NewsCard, ContactCard, Sidebar, and MapLegend components

**Files:**
- Create: `ui/src/components/StatCard.jsx`
- Create: `ui/src/components/NewsCard.jsx`
- Create: `ui/src/components/ContactCard.jsx`
- Create: `ui/src/components/Sidebar.jsx`
- Create: `ui/src/components/MapLegend.jsx`

- [ ] **Step 1: Create StatCard**

Create `ui/src/components/StatCard.jsx`:
```jsx
export default function StatCard({ label, value, subtitle, variant = 'light' }) {
  const base = variant === 'dark'
    ? 'bg-primary text-white'
    : 'bg-[var(--surface-container-low)]'

  return (
    <div className={`${base} p-8 rounded-xl flex flex-col justify-between h-48`}>
      <span className={`text-xs font-bold uppercase tracking-widest ${variant === 'dark' ? 'opacity-60' : 'text-secondary'}`}>
        {label}
      </span>
      <div className="space-y-1">
        <p className={`text-4xl font-headline ${variant === 'dark' ? '' : 'text-primary'}`}>{value}</p>
        <p className={`text-sm ${variant === 'dark' ? 'opacity-60' : 'text-[var(--on-surface-variant)]'}`}>{subtitle}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create NewsCard**

Create `ui/src/components/NewsCard.jsx`:
```jsx
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
```

- [ ] **Step 3: Create ContactCard**

Create `ui/src/components/ContactCard.jsx`:
```jsx
export default function ContactCard({ name, address, icon = 'location_on' }) {
  return (
    <div className="flex gap-4">
      <span className="material-symbols-outlined text-secondary">{icon}</span>
      <div>
        <h4 className="font-bold text-primary">{name}</h4>
        <p className="text-[var(--on-surface-variant)] text-sm mt-1 leading-relaxed whitespace-pre-line">
          {address}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Sidebar**

Create `ui/src/components/Sidebar.jsx`:
```jsx
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
          <span className="material-symbols-outlined mb-4">warning</span>
          <h4 className="font-bold mb-2">{alert.title}</h4>
          <p className="text-sm opacity-80 leading-relaxed">{alert.message}</p>
        </div>
      )}
    </aside>
  )
}
```

- [ ] **Step 5: Create MapLegend**

Create `ui/src/components/MapLegend.jsx`:
```jsx
const LEGEND_ITEMS = [
  { color: 'bg-primary', label: 'Siège Régional' },
  { color: 'bg-secondary', label: 'Antenne Départementale' },
  { color: 'bg-accent', label: 'Trésorerie Spécialisée' },
  { color: 'bg-[var(--outline-variant)]', label: "Zone d'Expérimentation" },
]

export default function MapLegend() {
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--outline-variant)]/20 pt-8">
      {LEGEND_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-4 h-4 ${item.color} rounded-full`} />
          <span className="text-sm font-medium text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Verify all components compile**

```bash
cd ui && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/StatCard.jsx src/components/NewsCard.jsx src/components/ContactCard.jsx src/components/Sidebar.jsx src/components/MapLegend.jsx
git commit -m "feat: add StatCard, NewsCard, ContactCard, Sidebar, MapLegend components"
```

---

### Task 7: Create department mock data

**Files:**
- Create: `ui/src/data/departments.js`

- [ ] **Step 1: Create the departments data file**

Create `ui/src/data/departments.js`:
```js
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
      { name: `Centre des Finances Publiques`, address: `Département ${id}` },
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
```

- [ ] **Step 2: Verify the data module compiles**

```bash
cd ui && npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/departments.js
git commit -m "feat: add department mock data with all 101 departments"
```

---

### Task 8: Create the France SVG map component

**Files:**
- Create: `ui/src/components/FranceMap.jsx`

- [ ] **Step 1: Create FranceMap component**

Create `ui/src/components/FranceMap.jsx`. This component renders an inline SVG of metropolitan France with department paths. Each department is clickable and navigates to `/department/:id`.

```jsx
import { useNavigate } from 'react-router'
import { getDepartmentName } from '../data/departments'

// Simplified but recognizable SVG paths for metropolitan France departments
// Each path has a data-id matching the department number
const DEPARTMENTS = [
  { id: '59', d: 'M480,20 L520,20 540,40 530,70 500,80 470,70 460,40Z' },
  { id: '62', d: 'M440,30 L470,30 470,70 440,80 410,60Z' },
  { id: '80', d: 'M450,80 L490,80 500,110 470,120 440,100Z' },
  { id: '02', d: 'M500,70 L540,70 550,100 520,120 490,100Z' },
  { id: '08', d: 'M550,60 L590,60 600,90 570,110 540,90Z' },
  { id: '60', d: 'M450,110 L490,100 510,130 480,150 440,140Z' },
  { id: '76', d: 'M370,60 L420,50 440,80 420,110 380,110 360,80Z' },
  { id: '27', d: 'M360,100 L400,100 420,130 390,160 350,150 340,120Z' },
  { id: '14', d: 'M290,100 L340,90 360,110 340,140 300,140 280,120Z' },
  { id: '50', d: 'M240,110 L280,100 290,130 270,170 240,170 220,140Z' },
  { id: '61', d: 'M340,140 L380,130 400,160 380,190 340,190 320,160Z' },
  { id: '28', d: 'M390,150 L430,140 450,170 430,200 390,200 370,170Z' },
  { id: '78', d: 'M430,140 L460,140 470,160 450,170 430,160Z' },
  { id: '95', d: 'M450,125 L475,125 480,140 460,145 445,135Z' },
  { id: '75', d: 'M465,140 L480,140 482,152 468,152Z' },
  { id: '93', d: 'M482,138 L495,138 497,150 484,150Z' },
  { id: '94', d: 'M472,152 L490,152 492,164 474,164Z' },
  { id: '92', d: 'M455,142 L468,142 470,155 457,155Z' },
  { id: '77', d: 'M495,130 L540,120 560,150 540,180 500,180 485,155Z' },
  { id: '91', d: 'M450,170 L490,165 500,190 480,210 450,200Z' },
  { id: '51', d: 'M540,90 L590,90 610,120 590,150 540,150 520,120Z' },
  { id: '55', d: 'M600,80 L640,80 650,110 630,140 600,130Z' },
  { id: '57', d: 'M640,60 L680,50 700,80 680,110 640,110Z' },
  { id: '54', d: 'M630,100 L670,100 680,130 660,160 630,150Z' },
  { id: '67', d: 'M690,70 L730,60 740,100 720,130 690,120Z' },
  { id: '68', d: 'M690,130 L720,130 730,160 710,190 680,170Z' },
  { id: '88', d: 'M650,130 L690,130 700,160 680,190 650,180Z' },
  { id: '10', d: 'M540,150 L580,140 600,170 580,200 540,200 520,170Z' },
  { id: '52', d: 'M600,150 L640,140 660,170 640,200 600,200Z' },
  { id: '70', d: 'M650,170 L690,160 700,190 680,220 650,210Z' },
  { id: '90', d: 'M700,180 L720,180 725,200 705,205Z' },
  { id: '25', d: 'M700,200 L730,190 740,220 720,250 700,240Z' },
  { id: '39', d: 'M670,220 L700,210 710,240 690,270 660,260Z' },
  { id: '89', d: 'M500,190 L540,180 560,210 540,240 500,240 480,210Z' },
  { id: '45', d: 'M430,200 L470,190 500,220 480,250 440,250 420,220Z' },
  { id: '41', d: 'M400,220 L440,210 450,240 430,270 400,260Z' },
  { id: '37', d: 'M360,230 L400,220 410,260 390,290 360,280Z' },
  { id: '36', d: 'M400,260 L430,250 450,280 430,310 400,300Z' },
  { id: '18', d: 'M440,250 L480,240 500,270 480,300 440,300 420,270Z' },
  { id: '58', d: 'M500,240 L540,230 560,260 540,290 500,290 480,260Z' },
  { id: '21', d: 'M560,200 L600,190 620,220 600,250 560,250 540,220Z' },
  { id: '71', d: 'M600,240 L640,230 660,260 640,290 600,290 580,260Z' },
  { id: '03', d: 'M470,300 L510,290 530,320 510,350 470,350 450,320Z' },
  { id: '23', d: 'M420,310 L460,300 470,330 450,360 420,350Z' },
  { id: '87', d: 'M370,310 L410,300 430,330 410,360 370,360Z' },
  { id: '86', d: 'M330,290 L370,280 390,310 370,340 330,340Z' },
  { id: '79', d: 'M290,270 L330,260 350,290 330,320 290,320Z' },
  { id: '85', d: 'M240,290 L280,280 290,310 270,340 240,330Z' },
  { id: '44', d: 'M240,250 L280,240 290,270 270,300 240,290Z' },
  { id: '49', d: 'M290,240 L330,230 350,260 330,290 290,280Z' },
  { id: '53', d: 'M290,200 L330,190 350,220 330,250 290,240Z' },
  { id: '35', d: 'M250,180 L290,170 310,200 290,230 250,230 230,200Z' },
  { id: '56', d: 'M200,200 L240,190 260,220 240,250 200,250Z' },
  { id: '22', d: 'M200,160 L240,150 260,180 240,210 200,200Z' },
  { id: '29', d: 'M150,170 L190,160 210,190 190,220 150,220 130,190Z' },
  { id: '72', d: 'M340,210 L380,200 400,230 380,260 340,260Z' },
  { id: '42', d: 'M570,290 L600,280 620,310 600,340 570,330Z' },
  { id: '69', d: 'M600,270 L630,260 650,290 630,310 600,300Z' },
  { id: '01', d: 'M640,280 L670,270 690,300 670,320 640,310Z' },
  { id: '74', d: 'M690,260 L720,250 740,280 720,300 690,290Z' },
  { id: '73', d: 'M700,300 L730,290 750,320 730,350 700,340Z' },
  { id: '38', d: 'M630,320 L660,310 680,340 660,370 630,360Z' },
  { id: '05', d: 'M690,340 L720,330 740,360 720,390 690,380Z' },
  { id: '26', d: 'M620,350 L650,340 670,370 650,400 620,390Z' },
  { id: '63', d: 'M520,330 L560,320 580,350 560,380 520,380 500,350Z' },
  { id: '43', d: 'M560,350 L590,340 610,370 590,400 560,390Z' },
  { id: '15', d: 'M490,360 L530,350 550,380 530,410 490,410 470,380Z' },
  { id: '19', d: 'M420,360 L460,350 480,380 460,410 420,410Z' },
  { id: '46', d: 'M400,380 L430,370 450,400 430,430 400,420Z' },
  { id: '24', d: 'M360,360 L400,350 420,380 400,410 360,410Z' },
  { id: '16', d: 'M330,340 L370,330 390,360 370,390 330,390Z' },
  { id: '17', d: 'M280,340 L320,330 340,360 320,390 280,390Z' },
  { id: '33', d: 'M260,370 L300,360 320,400 300,440 260,440 240,400Z' },
  { id: '47', d: 'M320,400 L360,390 380,420 360,450 320,450Z' },
  { id: '82', d: 'M380,430 L410,420 430,450 410,470 380,460Z' },
  { id: '81', d: 'M440,430 L470,420 490,450 470,480 440,470Z' },
  { id: '12', d: 'M480,400 L520,390 540,420 520,450 480,450Z' },
  { id: '48', d: 'M540,390 L570,380 590,410 570,440 540,430Z' },
  { id: '07', d: 'M590,380 L620,370 640,400 620,430 590,420Z' },
  { id: '04', d: 'M660,380 L690,370 710,400 690,430 660,420Z' },
  { id: '06', d: 'M720,380 L750,370 770,400 750,420 720,410Z' },
  { id: '84', d: 'M640,410 L670,400 690,430 670,460 640,450Z' },
  { id: '83', d: 'M690,430 L720,420 740,450 720,470 690,460Z' },
  { id: '13', d: 'M650,440 L690,430 700,460 680,480 650,470Z' },
  { id: '30', d: 'M580,420 L610,410 630,440 610,470 580,460Z' },
  { id: '34', d: 'M550,440 L580,430 600,460 580,490 550,480Z' },
  { id: '11', d: 'M500,470 L530,460 550,490 530,520 500,510Z' },
  { id: '09', d: 'M440,490 L470,480 490,510 470,540 440,530Z' },
  { id: '31', d: 'M410,460 L450,450 470,480 450,510 410,510Z' },
  { id: '32', d: 'M360,450 L400,440 420,470 400,500 360,500Z' },
  { id: '40', d: 'M280,430 L320,420 340,450 320,480 280,480Z' },
  { id: '64', d: 'M300,480 L340,470 360,500 340,530 300,530Z' },
  { id: '65', d: 'M360,500 L390,490 410,520 390,550 360,540Z' },
  { id: '66', d: 'M490,510 L520,500 540,530 520,560 490,550Z' },
  { id: '2A', d: 'M770,460 L800,450 810,480 790,510 770,500Z' },
  { id: '2B', d: 'M770,420 L800,410 810,440 790,460 770,450Z' },
]

export default function FranceMap() {
  const navigate = useNavigate()

  return (
    <svg viewBox="100 0 750 580" className="w-full h-full max-h-[600px]">
      <g>
        {DEPARTMENTS.map((dept) => (
          <g key={dept.id} onClick={() => navigate(`/department/${dept.id}`)}>
            <title>{getDepartmentName(dept.id)} ({dept.id})</title>
            <path
              d={dept.d}
              className="map-department"
              fill="#48626e"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
```

Note: The SVG paths above are schematic approximations. For a production-quality map, replace the `DEPARTMENTS` array with real geographic SVG path data from a public-domain France department SVG (e.g., from Wikimedia Commons or simplemaps). The component structure and interactivity remain identical — only the `d` attribute values change.

- [ ] **Step 2: Verify the component compiles**

```bash
cd ui && npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/FranceMap.jsx
git commit -m "feat: add interactive FranceMap SVG component with department navigation"
```

---

### Task 9: Build HomePage

**Files:**
- Modify: `ui/src/pages/HomePage.jsx`

- [ ] **Step 1: Implement the full HomePage**

Replace `ui/src/pages/HomePage.jsx` with:
```jsx
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
                <span className="material-symbols-outlined text-[var(--secondary-fixed-dim)] text-4xl mb-4">account_balance</span>
                <h3 className="text-white font-bold text-lg mb-2">101 Préfectures</h3>
                <p className="text-[var(--primary-fixed-dim)] text-sm">Un maillage complet sur tout le territoire national.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 mt-12">
                <span className="material-symbols-outlined text-[var(--secondary-fixed-dim)] text-4xl mb-4">shield_with_heart</span>
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
                    <div className="flex-shrink-0 w-16 h-16 bg-[var(--secondary-container)] rounded-lg flex flex-col items-center justify-center text-[var(--on-secondary-container)] font-bold">
                      <span className="text-lg">15</span>
                      <span className="text-[10px] uppercase">Oct</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-primary hover:text-accent cursor-pointer transition-colors">Réforme de la taxe foncière 2024</h4>
                      <p className="text-secondary line-clamp-2">Les nouveaux barèmes applicables pour les propriétés bâties sont désormais consultables par région.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-[var(--secondary-container)] rounded-lg flex flex-col items-center justify-center text-[var(--on-secondary-container)] font-bold">
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
                <span className="material-symbols-outlined text-4xl mb-4">verified_user</span>
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
```

- [ ] **Step 2: Verify HomePage renders**

```bash
cd ui && npm run dev
```

Open `http://localhost:5173/`. Expected: Full homepage with hero, map, bento grid, and newsletter CTA matching the stitch design.

- [ ] **Step 3: Commit**

```bash
git add src/pages/HomePage.jsx
git commit -m "feat: implement HomePage with hero, interactive map, bento grid, and newsletter CTA"
```

---

### Task 10: Build DepartmentPage

**Files:**
- Modify: `ui/src/pages/DepartmentPage.jsx`

- [ ] **Step 1: Implement the full DepartmentPage**

Replace `ui/src/pages/DepartmentPage.jsx` with:
```jsx
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
        title={`Administration Fiscale`}
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
```

- [ ] **Step 2: Verify DepartmentPage renders**

```bash
cd ui && npm run dev
```

Navigate to `http://localhost:5173/department/31`. Expected: Full department page with hero, sidebar, stats, contacts, hours, and news matching the stitch design for Haute-Garonne.

Navigate to `http://localhost:5173/department/75`. Expected: Paris page with default placeholder data.

Navigate to `http://localhost:5173/department/999`. Expected: "Département introuvable" error page.

- [ ] **Step 3: Commit**

```bash
git add src/pages/DepartmentPage.jsx
git commit -m "feat: implement DepartmentPage with dynamic department data and all sections"
```

---

### Task 11: Final integration test and cleanup

**Files:**
- Potentially modify any file with issues

- [ ] **Step 1: Run full build**

```bash
cd ui && npm run build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Run lint**

```bash
cd ui && npm run lint
```

Expected: No lint errors. Fix any that appear.

- [ ] **Step 3: Manual smoke test**

```bash
cd ui && npm run preview
```

Test the following flows:
1. Homepage loads with header, hero, map, bento grid, newsletter, footer
2. Hover over map departments — fill color changes to burgundy
3. Click a department — navigates to `/department/:id`
4. Department page shows correct name in hero, breadcrumbs, sidebar, stats
5. Click "Accueil" breadcrumb — navigates back to homepage
6. Header glass effect visible on scroll
7. Footer renders on all pages
8. Responsive: resize to mobile width — sidebar hides, layout stacks vertically

- [ ] **Step 4: Delete unused assets from starter template**

Remove starter template files no longer needed:
```bash
cd ui
rm src/assets/react.svg src/assets/vite.svg src/assets/hero.png
rm public/icons.svg
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete stitch-to-react migration with all pages and components"
```
