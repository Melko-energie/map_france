# Stitch → React Pages Design Spec

## Overview

Migrate the 3 static HTML pages from `stitch/` into the existing `ui/` React 19 + Vite project, using Tailwind CSS + DaisyUI with a custom theme matching the Statelier design system.

## Stack Additions

- **Tailwind CSS v4** + **DaisyUI** plugin
- **React Router v7** for client-side routing
- **Google Fonts:** Noto Serif (headings), Public Sans (body)
- **Material Symbols Outlined** (icons via Google Fonts CDN)

## Custom DaisyUI Theme ("statelier")

| Token | Value | Usage |
|-------|-------|-------|
| primary | `#000d2c` | Midnight Blue — core brand, hero backgrounds, header |
| secondary | `#48626e` | Slate Grey — softening bridge, sidebar accents |
| accent | `#280006` | Antique Burgundy — high-impact accents, map hover |
| base-100 | `#ffffff` | Main surface |
| base-200 | `#f3f4f5` | Container surface low |
| base-300 | `#e8eaec` | Container surface lowest |
| primary-content | `#ffffff` | Text on primary backgrounds |
| secondary-content | `#ffffff` | Text on secondary backgrounds |
| accent-content | `#ffffff` | Text on accent backgrounds |

## Folder Structure

```
src/
├── main.jsx                    # Entry point, mounts RouterProvider
├── App.jsx                     # Root layout (Header + Outlet + Footer)
├── index.css                   # Tailwind directives + custom theme + fonts
├── assets/
│   └── france-departments.svg  # Real SVG map of France (101 departments)
├── components/
│   ├── Header.jsx              # Fixed glass-effect navbar
│   ├── Footer.jsx              # 4-column footer
│   ├── Hero.jsx                # Reusable dark hero section
│   ├── StatCard.jsx            # Stat indicator card
│   ├── NewsCard.jsx            # News article card with hover zoom
│   ├── ContactCard.jsx         # Contact center card
│   ├── Sidebar.jsx             # Quick navigation sidebar
│   └── MapLegend.jsx           # Map legend with categories
├── pages/
│   ├── HomePage.jsx            # Interactive map portal
│   └── DepartmentPage.jsx      # Department details (dynamic)
├── data/
│   └── departments.js          # Mock data: department ID → name, stats, contacts
└── router.jsx                  # Route definitions
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Interactive map portal |
| `/department/:id` | `DepartmentPage` | Department details page |

## Page: HomePage (`/`)

Recreates `stitch/interactive_map_of_france`.

### Sections (top to bottom)

1. **Hero section**
   - Editorial gradient background (`#000d2c` → `#002157`)
   - "Portail Officiel" pill badge
   - Large serif headline: "Consultez votre Administration Fiscale par Département"
   - 2 CTA buttons: "Commencer l'exploration" (primary), "En savoir plus" (outline)
   - Right column: 2 feature cards (101 Préfectures, Sécurité Garantie) with icons

2. **Interactive map section**
   - "Cartographie Interactive" heading with description
   - Full SVG map of France with all 101 departments as clickable `<path>` elements
   - Each department: hover → fill `#280006`, click → navigate to `/department/:id`
   - Floating tooltip: "Sélectionnez une zone"
   - MapLegend below with 4 categories (Siège Régional, Antenne Départementale, Trésorerie Spécialisée, Zone d'Expérimentation)

3. **Bento grid section**
   - Left (8 cols): "Actualités Fiscales Territoriales" card with 2 news items (date badges)
   - Right (4 cols): 2 stacked cards — "Espace Professionnel" (accent bg) + "Besoin d'aide?" (primary bg) with phone number

4. **Newsletter CTA section**
   - Email subscription form with heading and submit button

## Page: DepartmentPage (`/department/:id`)

Recreates `stitch/administration_fiscale_details`, made dynamic via route param.

### Sections

1. **Hero section**
   - Breadcrumb: Accueil > Directions Départementales > {Department Name} ({id})
   - Large serif heading with department name
   - Italicized subtitle in light blue
   - Decorative `account_balance` icon (30rem, faded background)

2. **Content area** (12-col grid)
   - **Sidebar** (3 cols, hidden on mobile, visible lg+):
     - Director information (name, title)
     - Quick links: "Nous contacter", "Prendre RDV", "Carte des centres"
     - Alert box: filing period deadline warning
   - **Main content** (9 cols):
     - **Regional indicators:** 3 StatCards (taxpayers count, annual collection €, satisfaction %)
     - **Contact centers:** 2 ContactCards (primary office + secondary office) with addresses, hours, phone
     - **News:** 2-column grid of NewsCards with images and hover zoom

### Mock Data Strategy

`src/data/departments.js` exports:
- `DEPARTMENTS` object: maps department ID (string) to `{ name, code, director, stats, contacts, news }`
- Haute-Garonne (31) has full data matching the stitch page
- Other departments get generated defaults (name from a complete list, placeholder stats)

## Shared Components

### Header
- Fixed top, `z-50`
- `backdrop-blur-[20px]`, 80% opacity background (glass effect)
- Left: République Française branding (logo + text)
- Center: nav links (Fiscalité, Particuliers, Entreprises, Documentation)
- Right: search input, language switcher, "Mon Espace" button

### Footer
- 4-column grid layout
- Col 1: République Française branding
- Col 2: Service links
- Col 3: Legal information links
- Col 4: Social media links
- Bottom bar: copyright + legal text

### Hero
- Reusable component accepting props: `title`, `subtitle`, `breadcrumbs`, `children` (for CTAs/extra content)
- Editorial gradient background
- Optional decorative icon

### StatCard
- Props: `icon`, `value`, `label`
- Tonal elevation (base-200 background)
- Ambient shadow: `0 8px 32px rgba(0,0,0,0.04)`

### NewsCard
- Props: `image`, `title`, `excerpt`, `date`
- Image container with `overflow-hidden`, image scales 1.05x on hover (500ms)
- No border — tonal elevation only

### ContactCard
- Props: `name`, `address`, `hours`, `phone`
- Icon + text layout
- Tonal elevation

### Sidebar
- Props: `director`, `quickLinks`, `alert`
- Hidden on mobile (`hidden lg:block`)
- Items highlight on hover via background color transition

### MapLegend
- Props: `items` (array of `{ color, label }`)
- Horizontal flex layout with color dots + labels

## Interaction Patterns (Statelier Standard)

| Pattern | Implementation |
|---------|---------------|
| All transitions | 300ms ease-out |
| Page entry | Elements slide up 8px + fade in |
| Map hover | Fill transitions to `#280006` over 200ms |
| Card hover | Subtle background shift |
| News image hover | Scale 1.05x over 500ms |
| Section separation | Background color shifts, NO 1px borders |
| Navigation hover | Color transition on links |
| Glass header | `backdrop-blur-[20px]` + `bg-opacity-80` |

## Typography

| Element | Font | Weight | Tracking |
|---------|------|--------|----------|
| Headlines (h1-h3) | Noto Serif | 700 | -0.02em |
| Body text | Public Sans | 400 | normal |
| UI labels/buttons | Public Sans | 600 | normal |
| Nav links | Public Sans | 500 | normal |

## SVG Map Requirements

- Real geographic SVG of France with all 101 departments (including overseas)
- Each department as a separate `<path>` with `data-id` attribute matching department number
- Inline in the React component (not an `<img>`) for interactivity
- Accessible: each path has a `<title>` with department name
