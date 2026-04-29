```markdown
# Design System Specification: The Statelier Standard

## 1. Overview & Creative North Star: "The Modern Chancellor"
This design system is built to transform the often-impenetrable world of fiscal administration into a sanctuary of clarity, prestige, and trust. Our Creative North Star is **"The Modern Chancellor"**—an aesthetic that balances the historical weight of French institutional authority with the effortless precision of contemporary digital craftsmanship.

We reject the "government template" look. Instead of rigid grids and utilitarian boxes, we utilize **Editorial Asymmetry**. By leveraging high-contrast typography scales and generous, intentional whitespace (negative space), we create a layout that feels curated rather than generated. The experience should feel like reading a high-end financial journal or a bespoke legal brief: authoritative, calm, and impeccably organized.

---

## 2. Colors: Tonal Authority
The palette is rooted in the depth of French heritage. We use a "High-Value" color strategy where deep navy provides the foundation, and rich burgundy accents signify critical actions or highlights.

### The Palette (Material Logic)
*   **Primary (`#000d2c`):** Our "Midnight Blue." To be used for core brand presence and high-level headers.
*   **Secondary (`#48626e`):** "Slate Grey." Provides a softening bridge between the primary blue and the background.
*   **Tertiary (`#280006`):** "Antique Burgundy." Used sparingly for high-impact accents or critical "On-Surface" containers to denote importance.
*   **Surface Tiers:** Use `surface-container-low` (#f3f4f5) for large page sections and `surface-container-lowest` (#ffffff) for floating cards to create natural elevation.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** 
Structural separation must be achieved through background shifts. A section using `surface-container-low` should sit against a `surface` background to define its boundary. This creates a "seamless" interface that feels expensive and expansive.

### Signature Textures & Glassmorphism
*   **The Glass Rule:** For navigation bars or floating utility panels, use a semi-transparent `surface` color with a `backdrop-blur` of 20px. This creates a "Frosted Glass" effect that prevents the UI from feeling "pasted on" the content.
*   **The Editorial Gradient:** Use a subtle linear gradient (from `primary` to `primary-container`) on hero sections to add "soul" and depth, preventing the flat, sterile look of standard government portals.

---

## 3. Typography: The Intellectual Contrast
We pair the heritage of the serif with the efficiency of the sans-serif to create an "Editorial Hierarchy."

*   **Display & Headlines (Noto Serif):** These are our "Voice of Authority." Set these with slightly tighter letter-spacing (-0.02em) to evoke the feeling of a printed broadsheet. Use `display-lg` (3.5rem) for hero statements to command immediate attention.
*   **Body & Titles (Public Sans):** This is our "Voice of Reason." Public Sans provides a neutral, highly legible contrast to the serif headings. 
*   **The "Golden Ratio" of Type:** Always ensure a significant jump between `headline-lg` and `body-lg`. The dramatic scale difference is what separates "Institutional" design from "Standard" design.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows and borders are too "digital." We use **Tonal Layering** to mimic physical sheets of fine stationery.

*   **The Layering Principle:** 
    *   Level 0: `surface` (The desk).
    *   Level 1: `surface-container-low` (The folder).
    *   Level 2: `surface-container-lowest` (The document/card).
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, use a 32px blur with 4% opacity, tinted with the `on-surface` color. It should feel like a soft glow of light, not a black smudge.
*   **The "Ghost Border" Fallback:** If a container needs a perimeter for accessibility, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Precision & Grace

### Buttons (The "Seal of Action")
*   **Primary:** Solid `primary` background. Use `md` (0.375rem) roundedness—sharp enough to feel professional, soft enough to feel modern.
*   **Secondary:** Ghost style with a `ghost-border` (15% opacity `outline-variant`). On hover, transition to a subtle `surface-container-high` background.

### Cards & Lists (The Editorial Feed)
*   **Forbid Dividers:** Do not use horizontal lines between list items. Use 24px of vertical white space (from our spacing scale) to separate content.
*   **The "Inset" Card:** Use `surface-container-highest` for a card background to create a "recessed" look within a white page, perfect for calculators or fiscal forms.

### Input Fields (The "Scribe" Input)
*   **State:** Use `surface-container-low` as the background for the input area. On focus, the bottom border animates from 1px to 2px using the `primary` color. 
*   **Labels:** Use `label-md` in `on-surface-variant` (Slate) positioned strictly above the field—never floating inside.

### Chips (The "Taxonomy" Tags)
*   Utilize `secondary-container` with `on-secondary-container` text. These should be `full` rounded (pills) to provide a soft visual counterpoint to the sharp-edged grid.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but allow imagery or secondary stats to sit offset in the right columns.
*   **Use High-Quality Imagery:** Use photography of French architecture, textures of marble, or high-end office environments with a desaturated, "Slate" cool-tone filter.
*   **Prioritize Readability:** Maintain a line-length of 45-75 characters for all body text.

### Don't:
*   **Don't use 100% Black:** Always use `on-surface` (#191c1d) for text to keep the look sophisticated and "ink-like" rather than harsh.
*   **Don't use Drop Shadows on Buttons:** Keep buttons flat or use a subtle 2px vertical offset. Massive shadows break the "Institutional" seriousness.
*   **Don't Overcrowd:** If a page feels full, remove a component before you reduce the white space. Transparency is communicated through "breathing room."

---

## 7. Signature Interaction: "The Sophisticated Reveal"
All transitions between pages or states should use a **Standard Ease-Out** (300ms). Avoid "bouncy" animations. Elements should slide vertically by 8px while fading in, mimicking the subtle movement of a page being turned or a file being placed on a desk.