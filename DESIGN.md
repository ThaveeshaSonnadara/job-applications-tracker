---
name: "JobTracker"
description: "Dark-themed, glassmorphism job application tracker with gradient accents — built for signal over noise"
colors:
  # Primary Accent (gradient family)
  primary-deep-amethyst: "#a78bfa"
  primary-clear-azure: "#60a5fa"
  primary-seafoam: "#2dd4bf"
  primary-gradient: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #2dd4bf 100%)"
  primary-gradient-purple: "linear-gradient(135deg, #a78bfa, #818cf8)"
  primary-gradient-subtle: "linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(96, 165, 250, 0.1))"

  # Status / Semantic Accents
  accent-purple: "#a78bfa"
  accent-purple-dim: "rgba(167, 139, 250, 0.15)"
  accent-blue: "#60a5fa"
  accent-blue-dim: "rgba(96, 165, 250, 0.15)"
  accent-green: "#4ade80"
  accent-green-dim: "rgba(74, 222, 128, 0.15)"
  accent-orange: "#fb923c"
  accent-orange-dim: "rgba(251, 146, 60, 0.15)"
  accent-red: "#f87171"
  accent-red-dim: "rgba(248, 113, 113, 0.15)"
  accent-teal: "#2dd4bf"
  accent-teal-dim: "rgba(45, 212, 191, 0.15)"

  # Neutral / Background
  bg-primary: "#0a0a0f"
  bg-secondary: "#12121a"
  bg-tertiary: "#1a1a2e"
  bg-card: "rgba(26, 26, 46, 0.6)"
  bg-card-hover: "rgba(26, 26, 46, 0.85)"
  bg-glass: "rgba(255, 255, 255, 0.03)"
  bg-glass-hover: "rgba(255, 255, 255, 0.06)"

  # Borders
  border-primary: "rgba(255, 255, 255, 0.06)"
  border-secondary: "rgba(255, 255, 255, 0.1)"
  border-accent: "rgba(139, 92, 246, 0.3)"

  # Text
  text-primary: "#f1f5f9"
  text-secondary: "#94a3b8"
  text-tertiary: "#64748b"
  text-muted: "#475569"

typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.01em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
  mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"

rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"

components:
  btn-primary:
    backgroundColor: "{colors.primary-gradient-purple}"
    textColor: "white"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  btn-primary-hover:
    backgroundColor: "var(--gradient-purple)"
    textColor: "white"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  btn-secondary:
    backgroundColor: "{colors.bg-glass-hover}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  btn-danger:
    backgroundColor: "{colors.accent-red-dim}"
    textColor: "{colors.accent-red}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  btn-sm:
    backgroundColor: "{colors.primary-gradient-purple}"
    textColor: "white"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-hover:
    backgroundColor: "{colors.bg-card-hover}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  stat-card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  status-badge:
    backgroundColor: "{colors.accent-purple-dim}"
    textColor: "{colors.accent-purple}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  form-input:
    backgroundColor: "{colors.bg-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  form-input-focus:
    backgroundColor: "{colors.bg-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  sidebar-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  sidebar-link-active:
    backgroundColor: "{colors.accent-purple-dim}"
    textColor: "{colors.accent-purple}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  filter-tab:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  filter-tab-active:
    backgroundColor: "{colors.accent-purple-dim}"
    textColor: "{colors.accent-purple}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  table-header:
    backgroundColor: "{colors.bg-glass}"
    textColor: "{colors.text-tertiary}"
    rounded: "0"
    padding: "{spacing.md}"
  table-row-hover:
    backgroundColor: "{colors.bg-glass-hover}"
    textColor: "{colors.text-primary}"
    rounded: "0"
    padding: "{spacing.md}"
---

# Design System: JobTracker

## Overview

**Creative North Star: "The Signal Panel"**

A dark, glassmorphism command center for job search intelligence. The visual language prioritizes **scanability and signal clarity** over decoration — every accent color carries semantic meaning (pipeline stage, source channel, status health), and the primary gradient flows like a data visualization. Glassmorphism surfaces at rest create depth through translucency and blur; interaction adds a purposeful glow shadow that confirms state change. The layout is dense but breathable, built for a single user who checks this dashboard daily and needs to absorb pipeline health in seconds.

**Key Characteristics:**
- **Dark-first, glassmorphism depth** — backgrounds layer from near-black (`#0a0a0f`) through translucent cards with 20px backdrop blur
- **Gradient as data signature** — the purple→azure→seafoam gradient appears on the page title, primary buttons, and stat card top bars; it *is* the brand
- **Semantic color vocabulary** — 7 status colors + 6 source icons, each with a dedicated dim variant for badges/chips; never decorative
- **Hybrid elevation** — glass at rest (subtle border, blur), shadow glow on hover/focus/active — depth responds to user intent
- **Inter font, technical precision** — 800-weight display headlines with gradient fill, 600-weight labels with tracking, consistent 16px base rhythm
- **Micro-animations as feedback** — stagger fade-in on load, 0.2s transitions on all interactive elements, scale-down on press

## Colors

A **semantic, status-driven palette** built on a deep near-black canvas. The primary gradient (Deep Amethyst → Clear Azure → Seafoam) is the only multi-stop gradient and serves as the system's visual signature. Every other accent is a single hue with a paired `dim` variant (15% opacity) for badges, chips, and background washes.

### Primary (Gradient Family)
- **Deep Amethyst** (`#a78bfa`): Primary brand hue — page titles, active nav, primary button gradient start, stat card accent bars
- **Clear Azure** (`#60a5fa`): Gradient midpoint — primary button gradient center, applied status, links
- **Seafoam** (`#2dd4bf`): Gradient endpoint — offered status, success accents, pipeline end marker
- **Primary Gradient** (`linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #2dd4bf 100%)`): System signature — page titles, primary buttons, stat card top bars, focus rings

### Secondary / Semantic Accents (Status Colors)
Each status has a **vivid** variant (text, borders, indicators) and a **dim** variant (15% opacity backgrounds for badges/chips):
- **Deep Amethyst Dim** (`rgba(167, 139, 250, 0.15)`): SAVED status, active sidebar, filter tabs, primary focus rings
- **Clear Azure Dim** (`rgba(96, 165, 250, 0.15)`): APPLIED status, applied stat card
- **Signal Violet** (`#a78bfa` → same as Deep Amethyst): INTERVIEW_CALLED status
- **Amber Glow** (`#fb923c`): PHONE_CALL status — warmth for human conversation stage
- **Seafoam Dim** (`rgba(45, 212, 191, 0.15)`): EMAIL_RESPONSE status
- **Success Green** (`#4ade80` / `rgba(74, 222, 128, 0.15)`): OFFERED status — only unqualified positive
- **Alert Red** (`#f87171` / `rgba(248, 113, 113, 0.15)`): REJECTED status — only negative terminal state
- **Muted Slate** (`#64748b` / `rgba(100, 116, 139, 0.15)`): WITHDRAWN status — neutral terminal

### Neutral (Background / Text / Border Layers)
- **Void** (`#0a0a0f`): Page background — deepest layer
- **Charcoal Deep** (`#12121a`): Sidebar, elevated surfaces
- **Charcoal** (`#1a1a2e`): Card base (at 60% opacity with blur)
- **Glass Whisper** (`rgba(255, 255, 255, 0.03)`): Input backgrounds, hover overlays — barely perceptible
- **Glass Veil** (`rgba(255, 255, 255, 0.06)`): Hover states, table header — subtle lift
- **Hairline** (`rgba(255, 255, 255, 0.06)`): Default borders, dividers
- **Hairline Strong** (`rgba(255, 255, 255, 0.1)`): Hover borders, focus boundaries
- **Accent Hairline** (`rgba(139, 92, 246, 0.3)`): Active/focus borders, pipeline segments

- **Text Brilliant** (`#f1f5f9`): Primary content, headings
- **Text Muted** (`#94a3b8`): Secondary labels, descriptions, inactive icons
- **Text Dim** (`#64748b`): Tertiary metadata, timestamps, table headers
- **Text Whisper** (`#475569`): Placeholders, disabled states

### Named Rules
**The Gradient Signature Rule.** The primary gradient (Deep Amethyst → Clear Azure → Seafoam) appears in exactly four contexts: page title text-fill, primary button background, stat card top accent bar, and focus ring shadow. It is never used as a text color on body copy, never as a border, never as a background wash. Its rarity is the signal.

**The Dim Pairing Rule.** Every semantic accent *must* have a `dim` variant at 15% opacity for its badge/chip background. The vivid variant is for text, icons, and indicators only. No accent stands alone without its dim counterpart.

**The Terminal State Rule.** Only two statuses use green/red without a pipeline continuation: OFFERED (Success Green) and REJECTED (Alert Red). All other statuses flow forward. This visual finality is intentional.

## Typography

**Display Font:** Inter (Variable, 300–800) with system fallbacks
**Body Font:** Inter (same stack)
**Label/Mono Font:** JetBrains Mono / Fira Code for code, IDs, technical snippets

**Character:** Inter carries the entire system — no secondary display face. The personality comes from *weight contrast* (800 vs 400 vs 600) and *gradient text-fill* on headlines, not from font pairing. JetBrains Mono appears only in code blocks, copyable IDs, and technical metadata — a quiet technical accent.

### Hierarchy

- **Display** (800, `clamp(1.75rem, 4vw, 2.5rem)`, 1.1): Page titles only. Gradient text-fill via `background-clip: text`. Never used for card headers or section titles.
- **Headline** (700, `1.25rem`, 1.3): Card section titles (e.g., "Recent Applications", "Application Pipeline"). Solid Brilliant text.
- **Title** (600, `1rem`, 1.4): Application company names in tables, document titles, modal headers.
- **Body** (400, `0.95rem`, 1.6): Default prose — descriptions, answers, notes, form help text. Max line length ~75ch in wide containers.
- **Label** (600, `0.8rem`, 1.4, 0.05em tracking, uppercase): Table headers, form labels, filter tabs, status badge text. The technical voice.
- **Mono** (400, `0.85rem`, 1.5): Application IDs, timestamps in code contexts, API responses, JSON snippets.

### Named Rules
**The Gradient Headline Rule.** Only the page-level `h1` (`.page-title`) receives gradient text-fill. No other heading, label, or button text uses gradient fill — even if it's a primary action. The gradient is a page anchor, not a text style.

**The Label Tracking Rule.** All uppercase/semi-capitalized labels (table headers, form labels, filter tabs) use `letter-spacing: 0.05em` and `font-weight: 600` at `0.8rem`. This creates the technical "dashboard" scan rhythm. Never apply to body copy.

**The Mono Containment Rule.** JetBrains Mono appears only inside `<code>`, `<pre>`, `.font-mono` utility, or explicit technical metadata. It never leaks into UI labels or buttons.

## Layout

**Spatial Model:** Fixed sidebar (260px) + fluid main content (max 1400px) on desktop; sidebar collapses to drawer on mobile (<1024px). The main content centers at 1400px with 32px padding — a generous reading measure for tables and cards.

**Grid & Rhythm:** 16px base unit (`--space-md`). All spacing, padding, gaps, and margins derive from the 7-step scale (4/8/16/24/32/48/64). Cards use 24px internal padding; stat cards 24px; tables 16px cell padding. The stats grid is `repeat(auto-fit, minmax(200px, 1fr))` — responsive without breakpoints.

**Responsive Behavior:**
- **≥1024px:** Fixed sidebar left, main content margin-left 260px
- **<1024px:** Sidebar becomes fixed overlay (transform X), mobile menu button appears top-left, main content full-width with 16px padding
- **Table overflow:** Horizontal scroll on `.table-container` — never squash columns
- **Form rows:** 2-col (`1fr 1fr`) and 3-col (`1fr 1fr 1fr`) collapse to single column <1024px

**Density:** Comfortable — not compact. 24px card padding, 16px element gaps, 32px section margins. The dashboard breathes; the user scans it daily.

## Elevation & Depth

**Hybrid: Glass at Rest, Shadow on Interaction.** The system conveys depth through two mechanisms working in sequence:

1. **At Rest (Glassmorphism):** Surfaces use translucent backgrounds (`rgba(26,26,46,0.6)` for cards, `rgba(255,255,255,0.03)` for inputs) with `backdrop-filter: blur(20px)` and a hairline border (`rgba(255,255,255,0.06)`). This creates layering without shadows — the blur reveals what's beneath, the border defines the edge.

2. **On Interaction (Shadow Glow):** Hover, focus, and active states add `box-shadow: 0 0 20px rgba(167, 139, 250, 0.15)` (the `--shadow-glow` token) — a colored glow matching the primary accent. Cards also lift `-2px` to `-3px` on hover. The shadow is *colored*, not black — it reinforces the brand, not just depth.

**No ambient shadows.** There is no `box-shadow` on resting cards, no elevation scale (no `shadow-1`, `shadow-2`, `shadow-3`). Flat at rest; glow on intent.

### Shadow Vocabulary
- **Glow** (`0 0 20px rgba(167, 139, 250, 0.15)`): Primary interaction shadow — card hover, primary button hover, stat card hover, focus rings (3px spread). The *only* colored shadow.
- **Ambient Low** (`0 1px 3px rgba(0, 0, 0, 0.3)`): Rare — loading spinner only
- **Ambient Medium** (`0 4px 12px rgba(0, 0, 0, 0.4)`): Unused in current implementation (reserved)
- **Ambient High** (`0 8px 30px rgba(0, 0, 0, 0.5)`): Unused in current implementation (reserved)

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest — no box-shadow, no elevation. Depth is conveyed through background opacity (layering), backdrop blur (material), and hairline borders (edges). Shadows appear *only* as a response to state: hover, focus, active.

**The Colored Glow Rule.** The single interaction shadow (`--shadow-glow`) uses the primary accent hue (Deep Amethyst at 15% opacity). Black shadows do not exist in the interaction vocabulary. The glow *is* the brand responding.

**The No-Elevation-Scale Rule.** There is no `shadow-sm`/`md`/`lg` progression for component elevation. Cards don't "float higher" on hover — they glow and lift 2-3px. The system has two states: rest and engaged.

## Shapes

**Form Language: Gently Rounded, Pill-Capped.** The radius scale (6/10/14/20/9999) maps to component hierarchy:

- **6px (`--radius-sm`):** Chart bar fills, small inline elements
- **10px (`--radius-md`):** Buttons, inputs, selects, sidebar links, filter tabs, status badges (pill via `full`), table header cells
- **14px (`--radius-lg`):** Cards, stat cards, answer cards, interview cards, document cards — the primary container radius
- **20px (`--radius-xl`):** Reserved for future modal/dialog containers
- **9999px (`--radius-full`):** Status badges, filter chips, avatar/icon containers — fully rounded pills

**Borders:** Hairline (1px) only. `rgba(255,255,255,0.06)` default; `rgba(255,255,255,0.1)` hover; `rgba(139,92,246,0.3)` active/focus. No heavy borders, no double borders.

**Silhouettes:** Cards are rectangular with 14px radius. Buttons are 10px radius with 10px/20px internal padding. The pipeline bar is a 8px tall fully-rounded track with segmented fills — a data visualization shape, not a UI container.

### Named Rules
**The Container Radius Rule.** All content containers (cards, stat cards, answer cards, interview cards, doc cards) use `--radius-lg` (14px). Buttons and inputs use `--radius-md` (10px). The 4px step between them creates a visible hierarchy: containers are softer; actions are sharper.

**The Pill Identity Rule.** Status badges, filter chips, and icon containers use `--radius-full`. This distinguishes *labels/tags* from *containers/actions* at a glance. Never apply `full` to a button or card.

**The Hairline Only Rule.** Borders are always 1px. No 2px emphasis borders, no inset borders for focus — focus uses the 3px accent glow spread (`0 0 0 3px var(--accent-purple-dim)`) instead.

## Components

### Buttons
**Character:** Tactile, confident, gradient-primary as the only filled style.

- **Primary (`.btn-primary`):** `--gradient-purple` background (Deep Amethyst → Clear Azure), white text, 10px radius, 10px/20px padding, 600 weight. Hover: glow shadow + `-1px` lift. Active: `scale(0.97)`. Focus: 3px Deep Amethyst Dim spread.
- **Secondary (`.btn-secondary`):** Glass Veil background, Brilliant text, Hairline Strong border, 10px radius. Hover: 10% white overlay + Amethyst border.
- **Ghost (`.btn-ghost`):** Transparent, Muted text. Hover: Glass Veil + Brilliant text.
- **Danger (`.btn-danger`):** Alert Red Dim background, Alert Red text, subtle Alert Red border. Hover: 25% Alert Red background.
- **Sizes:** `sm` (6px/14px, 0.8rem), `md` (default), `lg` (14px/28px, 1rem), `icon` (36px square).

**Do:** Use Primary for the single most important action per screen (Add Application, Submit, Generate).
**Don't:** Use Primary for destructive actions, secondary navigation, or multiple times on one screen without hierarchy.

### Cards / Containers
**Character:** Glassmorphism surfaces — translucent, blurred, bordered, lift-on-hover.

- **Base (`.card`):** Charcoal at 60% opacity, 20px blur, Hairline border, 14px radius, 24px padding. Hover: 85% opacity, Hairline Strong border, Glow shadow, `-2px` lift.
- **Stat Card (`.stat-card`):** Same base + 3px top accent bar (gradient or status color, hidden at rest, revealed on hover). Stagger fade-in animation on load.
- **Answer Card (`.answer-card`):** Base card + question header (Amethyst text, hairline divider), pre-wrap answer text, action bar top-divided.
- **Interview Card (`.interview-card`):** Base card + category pill (Technical=Azure, Behavioral=Amethyst, Company=Seafoam) + difficulty pill (Green/Amber/Red). Practiced state: Green border + 3% Green tint background.
- **Document Card (`.doc-card`):** Base card + 48px icon area (Amethyst Dim background), flex layout, `-2px` lift + Glow on hover.

**Do:** Use the base `.card` for any content container. Let hover do the work.
**Don't:** Add custom shadows, backgrounds, or radii to cards — the system handles elevation.

### Inputs / Fields
**Character:** Quiet at rest, expressive on focus.

- **Base (`.form-input`, `.form-select`, `.form-textarea`):** Glass Whisper background, Hairline border, 10px radius, 10px/14px padding, Brilliant text, Muted placeholder.
- **Focus:** Hairline → Accent Hairline (Amethyst 30%), + `0 0 0 3px` Deep Amethyst Dim spread. No outline.
- **Select:** Custom Amethyst-tinted dropdown chevron (SVG data URI), 36px right padding.
- **Checkbox Group (`.form-checkbox-label`):** Glass Whisper pill, Hairline border. Checked: Amethyst Dim background + Amethyst border + Amethyst text. Unchecked: Muted text. Input hidden; label is the target.

**Do:** Use the focus glow for all interactive inputs — it's the system's focus indicator.
**Don't:** Remove the 3px focus spread for aesthetic reasons — it's the accessibility contract.

### Navigation
**Sidebar (`.sidebar`):** Fixed 260px, Charcoal Deep background, Hairline right border, 24px padding. Logo: 40px gradient square + gradient-text title + Muted subtitle. Links: 10px radius, 8px/16px padding, Muted text → Brilliant on hover, Amethyst Dim + Amethyst text when active. Badge: Amethyst Dim pill, 0.75rem.

**Mobile:** Hamburger button (36px, Glass Veil + Hairline) top-left. Overlay: 50% black backdrop. Sidebar transforms in/out.

**Filter Tabs (`.filter-tabs`):** Glass Whisper container, 14px radius, Hairline border. Tabs: 10px radius, 8px/16px, Muted → Brilliant hover, Amethyst Dim + Amethyst active.

**Do:** Keep sidebar links as single-line with icon + label. Truncate if needed.
**Don't:** Add multi-level nesting, icons-only mode, or collapsible sections — the current 5-item flat nav is the system.

### Status Badges (`.status-badge`)
**Character:** Semantic pills — vivid text on dim background, icon + label.

- **Format:** Inline-flex, 6px gap, 4px/12px padding, full radius, 0.78rem, 600 weight, 0.02em tracking.
- **Colors:** Each status maps to its vivid/icon and dim/background from the semantic palette.
- **Icons:** Emoji (📋 📨 🎯 📞 📧 🎉 ❌ 🔙) — consistent, recognizable, no icon font dependency.

**Do:** Use the exact `STATUS_CONFIG` mapping — never improvise status colors.
**Don't:** Use badges for non-status metadata (source, work mode, difficulty) — those get their own chip styles.

### Pipeline Bar (`.pipeline-bar`)
**Character:** Data visualization as UI — 8px tall, fully rounded track, segmented gradient fills.

- **Track:** Glass Whisper background, full radius.
- **Segments:** Each status gets its vivid color, width = percentage of total apps, minimum 20px if >0. Smooth 0.5s width transition.
- **Legend:** Below bar — 10px status dot + label + count, wrapped flex.

**Do:** Treat as a funnel visualization — width encodes volume.
**Don't:** Use as a progress stepper (it's not linear steps; it's concurrent volumes).

### Tables (`.table-container` / `.table`)
**Character:** Dense, scannable, hover-revealed.

- **Header:** Glass Whisper background, Hairline bottom border, Dim text, uppercase, 0.05em tracking, 0.8rem, 16px padding.
- **Rows:** 16px padding, Hairline bottom border (transparent on last), Brilliant text. Hover: Glass Veil background.
- **Links:** Brilliant → Amethyst on hover, 500 weight.
- **Status column:** Status badge component.
- **Source column:** Emoji icon + label, 0.82rem.
- **Date column:** Dim text, 0.85rem, Clock icon (13px) inline.

**Do:** Horizontal overflow on container — never wrap or truncate cells.
**Don't:** Add row striping, sortable headers, or pagination — the dataset is small (<100 rows typical).

## Do's and Don'ts

### Do:
- **Do** use the primary gradient (Deep Amethyst → Clear Azure → Seafoam) only on: page titles (text-fill), primary buttons, stat card top bars, focus ring spreads. Nowhere else.
- **Do** pair every semantic accent with its `dim` variant (15% opacity) for badge/chip backgrounds. The vivid color is for text/icons/indicators only.
- **Do** keep surfaces flat at rest (glassmorphism + hairline border). Add the colored Glow shadow (`0 0 20px rgba(167,139,250,0.15)`) only on hover/focus/active.
- **Do** use `--radius-lg` (14px) for all content containers, `--radius-md` (10px) for actions/inputs, `--radius-full` for status pills. This 4px step is the shape hierarchy.
- **Do** use Inter 800 with gradient text-fill for page titles only. Inter 600 uppercase tracked for labels. Inter 400 for body. JetBrains Mono only for code/technical IDs.
- **Do** stagger fade-in (0.05s increments) on dashboard stat cards and lists. It creates the "panel loading" feel.
- **Do** use emoji icons for status badges (📋 📨 🎯 📞 📧 🎉 ❌ 🔙) and source chips (💼 🔍 ✉️ 🌐 🐓 📌). They're universal, lightweight, and fit the personal-tool tone.
- **Do** let tables horizontally scroll on mobile. The data is dense by design.
- **Do** use the 16px base spacing scale (4/8/16/24/32/48/64) for all margins, padding, gaps. No arbitrary pixel values.

### Don't:
- **Don't** use the primary gradient as a text color on body copy, card headers, or button labels. It's a page-anchor signature, not a text style.
- **Don't** use a semantic vivid color (Amethyst, Azure, Seafoam, Amber, Green, Red) as a background wash without its `dim` variant. The 15% opacity is the contract.
- **Don't** add ambient box-shadows to resting cards, buttons, or inputs. The system is flat at rest; depth responds to intent.
- **Don't** use black/gray shadows for interaction. The only interaction shadow is the colored Glow (Deep Amethyst at 15%).
- **Don't** create new radius values. The 5-step scale (6/10/14/20/9999) covers every component. No `8px`, `12px`, `16px` one-offs.
- **Don't** use borders thicker than 1px. Focus uses a 3px *spread* (glow), not a border.
- **Don't** replace emoji icons with Lucide/Iconify in status badges or source chips. The emoji set is the established visual language.
- **Don't** add a second display font. Inter carries the system through weight, gradient-fill, and tracking — not pairing.
- **Don't** add pagination, sorting, or virtualization to the applications table. The personal dataset stays small; scanning beats paging.
- **Don't** invent new spacing values. If 24px feels wrong, use 16px or 32px — the scale is the system.