---
meta:
  name: cmssy Marketing Design System
  description: Violet-to-purple gradient-led SaaS marketing system for an AI-powered page builder, blending a crisp neutral shadcn/Tailwind foundation with playful, luminous accent surfaces.
  color_space: oklch
  mode: light-first, dark-parity
  base_palette: neutral

color:
  brand:
    primary:
      value: "#7c3aed"
      oklch: "oklch(0.541 0.281 293.009)"
      role: Brand anchor. Violet-600. Backs primary gradient, pill badges, focus dots, announcement bar default.
    primary_deep:
      value: "#6d28d9"
      oklch: "oklch(0.496 0.265 301.924)"
      role: Hover/pressed end of violet gradients (violet-700).
    secondary:
      value: "#9333ea"
      oklch: "oklch(0.558 0.288 302.321)"
      role: Purple-600. Second stop in every signature gradient.
    secondary_deep:
      value: "#7e22ce"
      oklch: "oklch(0.496 0.265 301.924)"
      role: Purple-700. Hover end of the dual gradient.
    gradient_primary:
      type: linear-gradient
      angle: "to right"
      stops:
        - { color: "#7c3aed", position: "0%" }      # violet-600
        - { color: "#9333ea", position: "100%" }    # purple-600
      role: The signature CTA gradient. Used on primary buttons, logo tile, icon chips, accent rule.
    gradient_primary_hover:
      type: linear-gradient
      angle: "to right"
      stops:
        - { color: "#6d28d9", position: "0%" }      # violet-700
        - { color: "#7e22ce", position: "100%" }    # purple-700
    gradient_heading:
      type: linear-gradient
      angle: "to right"
      stops:
        - { color: "#7c3aed", position: "0%" }
        - { color: "#9333ea", position: "50%" }
        - { color: "#7c3aed", position: "100%" }
      role: bg-clip-text on display headlines; loops violet-purple-violet so the fill reads as a ribbon.
    gradient_hero_wash:
      type: linear-gradient
      angle: "to bottom right"
      stops:
        - { color: "#f5f3ff", position: "0%" }      # violet-50
        - { color: "#ffffff", position: "50%" }
        - { color: "#faf5ff", position: "100%" }    # purple-50
      role: Ambient page wash behind hero. In dark mode flips to violet-950/20 + purple-950/20 over background.
    gradient_cta_block:
      type: linear-gradient
      angle: "to bottom right"
      stops:
        - { color: "#7c3aed", position: "0%" }
        - { color: "#9333ea", position: "50%" }
        - { color: "#6d28d9", position: "100%" }
      role: Full-bleed violet slab used by CTA section and popular pricing card.
    accent_amber:
      value: "#fbbf24"
      oklch: "oklch(0.828 0.189 84.429)"
      role: "MOST POPULAR" pricing ribbon (amber-400 to orange-400 gradient).
    accent_orange:
      value: "#fb923c"
      role: Second stop of popular-plan ribbon.

  neutral_light:
    background:
      value: "#ffffff"
      oklch: "oklch(1 0 0)"
    foreground:
      value: "#252525"
      oklch: "oklch(0.145 0 0)"
    card:
      value: "#ffffff"
      oklch: "oklch(1 0 0)"
    card_foreground:
      value: "#252525"
      oklch: "oklch(0.145 0 0)"
    popover:
      value: "#ffffff"
      oklch: "oklch(1 0 0)"
    popover_foreground:
      value: "#252525"
      oklch: "oklch(0.145 0 0)"
    primary:
      value: "#343434"
      oklch: "oklch(0.205 0 0)"
      role: UI primary (button default). Brand violet is applied on top as a gradient override, not as a token.
    primary_foreground:
      value: "#fbfbfb"
      oklch: "oklch(0.985 0 0)"
    secondary:
      value: "#f7f7f7"
      oklch: "oklch(0.97 0 0)"
    secondary_foreground:
      value: "#343434"
      oklch: "oklch(0.205 0 0)"
    muted:
      value: "#f7f7f7"
      oklch: "oklch(0.97 0 0)"
    muted_foreground:
      value: "#8e8e8e"
      oklch: "oklch(0.556 0 0)"
    accent:
      value: "#f7f7f7"
      oklch: "oklch(0.97 0 0)"
    accent_foreground:
      value: "#343434"
      oklch: "oklch(0.205 0 0)"
    destructive:
      value: "#dc2626"
      oklch: "oklch(0.577 0.245 27.325)"
    border:
      value: "#e8e8e8"
      oklch: "oklch(0.922 0 0)"
    input:
      value: "#e8e8e8"
      oklch: "oklch(0.922 0 0)"
    ring:
      value: "#b4b4b4"
      oklch: "oklch(0.708 0 0)"
    section_alt:
      value: "#f8fafc80"
      tailwind: "bg-slate-50/50"
      role: Alternating section tint for Features, FAQ, Footer.

  neutral_dark:
    background:
      value: "#252525"
      oklch: "oklch(0.145 0 0)"
    foreground:
      value: "#fbfbfb"
      oklch: "oklch(0.985 0 0)"
    card:
      value: "#343434"
      oklch: "oklch(0.205 0 0)"
    card_foreground:
      value: "#fbfbfb"
      oklch: "oklch(0.985 0 0)"
    popover:
      value: "#343434"
      oklch: "oklch(0.205 0 0)"
    popover_foreground:
      value: "#fbfbfb"
      oklch: "oklch(0.985 0 0)"
    primary:
      value: "#ebebeb"
      oklch: "oklch(0.922 0 0)"
    primary_foreground:
      value: "#343434"
      oklch: "oklch(0.205 0 0)"
    secondary:
      value: "#444444"
      oklch: "oklch(0.269 0 0)"
    secondary_foreground:
      value: "#fbfbfb"
      oklch: "oklch(0.985 0 0)"
    muted:
      value: "#444444"
      oklch: "oklch(0.269 0 0)"
    muted_foreground:
      value: "#b4b4b4"
      oklch: "oklch(0.708 0 0)"
    accent:
      value: "#444444"
      oklch: "oklch(0.269 0 0)"
    accent_foreground:
      value: "#fbfbfb"
      oklch: "oklch(0.985 0 0)"
    destructive:
      value: "#f87171"
      oklch: "oklch(0.704 0.191 22.216)"
    border:
      oklch: "oklch(1 0 0 / 10%)"
      role: Translucent white hairline on dark surfaces.
    input:
      oklch: "oklch(1 0 0 / 15%)"
    ring:
      oklch: "oklch(0.556 0 0)"
    section_alt:
      value: "#0f172a80"
      tailwind: "bg-slate-900/50"

  status:
    info:
      bg: "#eff6ff"         # blue-50
      bg_dark: "#172554/30"
      border: "#bfdbfe"
      icon: "#2563eb"
    tip_success:
      bg: "#ecfdf5"          # emerald-50
      border: "#a7f3d0"
      icon: "#059669"
      accent: "#10b981"
    warning:
      bg: "#fffbeb"          # amber-50
      border: "#fde68a"
      icon: "#d97706"
      accent: "#f59e0b"
    danger:
      bg: "#fef2f2"          # red-50
      border: "#fecaca"
      icon: "#dc2626"
    note:
      bg: "#f4f4f5"          # zinc-100
      border: "#e4e4e7"
      icon: "#52525b"

  chart_light:
    chart_1: "oklch(0.646 0.222 41.116)"   # warm orange
    chart_2: "oklch(0.6 0.118 184.704)"    # teal
    chart_3: "oklch(0.398 0.07 227.392)"   # deep slate-blue
    chart_4: "oklch(0.828 0.189 84.429)"   # amber
    chart_5: "oklch(0.769 0.188 70.08)"    # golden

  chart_dark:
    chart_1: "oklch(0.488 0.243 264.376)"  # electric indigo
    chart_2: "oklch(0.696 0.17 162.48)"    # mint
    chart_3: "oklch(0.769 0.188 70.08)"    # gold
    chart_4: "oklch(0.627 0.265 303.9)"    # magenta-violet
    chart_5: "oklch(0.645 0.246 16.439)"   # coral

  code_surface:
    block_bg: "#18181b"       # zinc-900
    block_fg: "#fafafa"       # zinc-50
    inline_bg_light: "#f4f4f5" # zinc-100
    inline_fg_light: "#18181b"
    inline_bg_dark: "#27272a"  # zinc-800
    inline_fg_dark: "#fafafa"

typography:
  font_family:
    sans:
      stack: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      role: Everything. No custom web font is loaded; UI rides the OS UI font.
    mono:
      stack: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      role: Code blocks and inline code within prose.
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
    black: 900          # reserved for the giant 404 glitch heading
  tracking:
    tight: "-0.025em"   # display & h1/h2
    tighter: "-0.05em"  # 404 ultra-display
    normal: "0"
    wider: "0.05em"     # small caps on mobile nav section labels
  leading:
    tight: "1"           # 404 ultra-display
    snug: "1.2"
    normal: "1.5"
    relaxed: "1.625"     # prose body
  scale:
    display_xl:
      size: "clamp(4rem, 10vw + 1rem, 16rem)"   # 128-256px, 404 hero
      weight: 900
      tracking: "-0.05em"
      leading: "1"
    display_lg:
      size: "4.5rem"     # 72px hero h1 (text-7xl @ lg)
      weight: 700
      tracking: "-0.025em"
      leading: "1.05"
    display_md:
      size: "3.75rem"    # 60px sm:6xl
      weight: 700
    display_sm:
      size: "3rem"       # 48px base hero
      weight: 700
    h1:
      size: "2.25rem"    # 36px (text-4xl) section headings at sm+
      weight: 700
    h2:
      size: "1.875rem"   # 30px (text-3xl) mobile section heading
      weight: 700
    h3:
      size: "1.25rem"    # 20px card/plan heading
      weight: 700
    h4:
      size: "1.125rem"   # 18px feature title
      weight: 600
    body_lg:
      size: "1.125rem"   # 18px lead paragraph
      weight: 400
      leading: "1.625"
    body:
      size: "1rem"       # 16px
      weight: 400
      leading: "1.5"
    body_sm:
      size: "0.875rem"   # 14px meta, nav links
      weight: 400
    caption:
      size: "0.75rem"    # 12px badge ribbons, helper text
      weight: 500
      tracking: "0.025em"
  usage_notes:
    - "Section headings always pair a neutral lead phrase with a gradient-clipped highlight phrase on a following line or inline span."
    - "Body copy defaults to text-muted-foreground for anything that is not a heading or label."
    - "Line breaks in hero copy are deliberate — headline + <br> + gradient highlight. Never hyphenate the gradient word across lines."

spacing:
  unit: "0.25rem"          # Tailwind default (4px)
  scale:
    0: "0"
    1: "0.25rem"           # 4
    2: "0.5rem"            # 8
    3: "0.75rem"           # 12
    4: "1rem"              # 16
    6: "1.5rem"            # 24
    8: "2rem"              # 32
    10: "2.5rem"           # 40
    12: "3rem"             # 48
    16: "4rem"             # 64
    20: "5rem"             # 80
    24: "6rem"             # 96
  container:
    max_width: "80rem"     # 1280px
    padding_x: { base: "1rem", sm: "1.5rem", lg: "2rem" }
    gutter_grid: "1.5rem"  # card grids
    gutter_pricing: "2rem"
  section_padding_y:
    mobile: "4rem"
    standard: "6rem"       # py-24 is the universal section rhythm
    hero_min_height: "100vh"

radius:
  none: "0"
  xs: "0.125rem"
  sm: "0.375rem"           # base - 4 (buttons sm, pill-like controls)
  md: "0.5rem"             # base - 2 (inputs, default button)
  base: "0.625rem"         # --radius token, default for cards
  lg: "0.625rem"           # aliased to base
  xl: "0.75rem"            # dropdown panels, hero media frame
  2xl: "1rem"              # feature cards, floating geometric shards
  3xl: "1.5rem"            # large CTA slab
  full: "9999px"           # pills, avatars, badges, ping rings

shadow:
  xs:
    value: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
    role: Default shadcn button resting shadow.
  sm:
    value: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)"
    role: Scrolled header.
  md:
    value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  lg:
    value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
    role: Mega-menu dropdown, feature card hover, open FAQ item.
  xl:
    value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    role: Popular pricing card.
  2xl:
    value: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
    role: Hero product-shot frame.
  glow_primary:
    value: "0 10px 15px -3px rgb(124 58 237 / 0.25)"
    role: Primary CTA button lift (violet-500/25). Intensifies to /30 on hover.
  glow_primary_soft:
    value: "0 25px 50px -12px rgb(124 58 237 / 0.10)"
    role: Hero media shell. A restrained violet halo rather than a neutral drop.
  glow_primary_card:
    value: "0 20px 25px -5px rgb(124 58 237 / 0.25)"
    role: Popular pricing plan violet lift.
  accordion_open:
    value: "0 10px 15px -3px rgb(124 58 237 / 0.05)"
    role: Barely-there violet bloom when an FAQ item expands.

elevation:
  z_index:
    base: 0
    media_overlay: 10       # gradient fade on hero product shot
    header: 50
    dropdown: 50
    mobile_menu: 50
    overlay_modal: 60
  blur:
    orb: "64px"             # blur-3xl ambient color orbs
    backdrop: "16px"        # backdrop-blur-lg on scrolled header & dropdown

motion:
  easing:
    standard: "cubic-bezier(0.4, 0, 0.2, 1)"     # ease-out default
    radar: "cubic-bezier(0, 0.2, 0.4, 1)"         # ping rings
    linear: "linear"                               # glitch & scanline
  duration:
    fast: "150ms"          # mega-menu close delay / chevron rotate
    base: "200ms"          # accordion, chevron, icon translate
    medium: "300ms"        # card hover lift, header backdrop, icon scale
    slow: "4s"             # glitch & radar loops
    drift: "6s-9s"         # floating shard idle loop
    orb_pulse: "infinite, staggered 1s"
  named:
    accordion_down: "accordion-down 200ms ease-out"
    accordion_up: "accordion-up 200ms ease-out"
    orb_pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite"
    radar_ping: "nf-radar-ping 4s cubic-bezier(0, 0.2, 0.4, 1) infinite"
    glitch: "nf-glitch 4s linear infinite"
    glitch_reverse: "nf-glitch-reverse 4s linear infinite"
    drift: "nf-drift 6s ease-in-out infinite"
    drift_reverse: "nf-drift-reverse 7s ease-in-out infinite"
    scanline: "nf-scanline 8s linear infinite"
  principles:
    - "Hovers lift, never slide. Cards gain shadow, icons scale 1.10, buttons darken the gradient one step - no x/y translation."
    - "Ambient motion (orbs pulsing, shards drifting, radar pinging) is present but low-amplitude so it reads as depth, not distraction."
    - "Dropdowns fade with a 150ms delay on close to forgive imprecise mouse arcs; open is immediate."

effects:
  background_orbs:
    description: "Two 24rem (384px) violet-400/30 and purple-400/30 circles, blur-3xl (64px), pulsing with 1s offset behind hero."
    opacity: 0.3
    blur: "64px"
  grid_overlay:
    description: "Inline SVG plus-pattern tile, 60x60, at opacity 0.02 (0.1 over violet slabs)."
    tile_size: "60px"
    stroke_color: "#9c92ac / white"
  gradient_rings:
    description: "Four concentric 600px violet/15 rings radiating at 4s intervals on 404 page (nf-radar-ring)."
  floating_shards:
    description: "Rounded squares with violet/5 tint, backdrop-blur-sm, rotated 6-45deg, drifting 14-18px vertically."
  glitch_text:
    description: "Two chromatic layers (violet 541/281 at 0.6 opacity, violet 606/250 at 0.4) offset via clip-path insets and 2-4px translates."
  scanline:
    description: "Vertical foreground-colored linear gradient at opacity 0.015 sweeping 100% height over 8s."

components:
  button:
    base_radius: "0.5rem"
    base_height_default: "2.25rem"   # 36 / h-9
    base_height_sm: "2rem"
    base_height_lg: "2.5rem"
    base_height_hero: "3rem to 3.5rem"  # h-12 sm:h-14 for prominent CTAs
    variants:
      primary_gradient:
        background: "linear-gradient to right, violet-600 -> purple-600"
        hover_background: "linear-gradient violet-700 -> purple-700"
        foreground: "#ffffff"
        shadow: glow_primary
      secondary_outline:
        background: "background"
        border: "1px solid input"
        hover_background: "accent"
      ghost_on_violet:
        background: "rgb(255 255 255 / 0.10)"
        border: "1px solid rgb(255 255 255 / 0.30)"
        hover_background: "rgb(255 255 255 / 0.20)"
      inverted_on_violet:
        background: "#ffffff"
        foreground: "#7c3aed"
        hover_background: "#f5f3ff"  # violet-50
    focus_ring: "3px solid ring/50"
  badge_pill:
    radius: "9999px"
    padding: "0.5rem 1rem"
    background: "violet-100 / violet-900-30 dark"
    foreground: "violet-700 / violet-300 dark"
    typography: "0.875rem / 500"
    icon_size: "1rem"
  card:
    radius: "1rem"                   # rounded-2xl
    padding: "1.5rem"
    background: "background"
    border: "1px solid border"
    hover_shadow: lg
    icon_tile:
      size: "3rem"
      radius: "0.75rem"
      background: "violet-600 or author-defined hex"
      icon_color: "#ffffff"
      icon_size: "1.5rem"
  input:
    height: "2.5rem"
    radius: "0.5rem"
    border: "1px solid input"
    background: "background"
    focus: "ring/50 3px + border-ring"
  accordion_item:
    radius: "0.75rem"
    padding_x: "1.5rem"
    padding_y: "1.5rem"
    open_shadow: accordion_open
  dropdown_megamenu:
    radius: "0.75rem"
    padding: "1.25rem"
    background: "background/95 + backdrop-blur-lg"
    border: "1px solid border"
    shadow: lg
    column_min_widths:
      1: "17.5rem"
      2: "32.5rem"
      3: "42.5rem"
    child_item_icon_chip:
      size: "2rem"
      radius: "0.5rem"
      background_idle: "violet-100"
      background_hover: "violet-500"
      foreground_idle: "violet-600"
      foreground_hover: "#ffffff"
  hero_media_frame:
    radius: "0.75rem"
    shadow: glow_primary_soft
    overlay: "linear-gradient top transparent -> background"
    aspect_ratio: "16 / 9"
  pricing_popular_card:
    background: gradient_cta_block
    foreground: "#ffffff"
    scale: 1.05
    shadow: glow_primary_card
    ribbon:
      background: "linear-gradient amber-400 -> orange-400"
      foreground: "#000000"
      radius: "9999px"
  callout:
    info: { bg: "blue-50", border: "blue-200", icon: "blue-600" }
    tip: { bg: "emerald-50", border: "emerald-200", icon: "emerald-600" }
    warning: { bg: "amber-50", border: "amber-200", icon: "amber-600" }
    danger: { bg: "red-50", border: "red-200", icon: "red-600" }
    note: { bg: "zinc-100", border: "zinc-200", icon: "zinc-600" }

breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
  2xl: "1536px"

icon:
  library: "lucide-react"
  stroke_width: 2
  default_size: "1rem"
  feature_size: "1.5rem"
  social_size: "1.25rem"

imagery:
  style: "Soft-radiance product shots inside rounded-xl frames with a subtle violet halo. Avatar tiles use a violet-to-purple diagonal gradient with a single initial letter centered in white."
  avatar_cluster: "Five 40px circles, -space-x-3 overlap, 2px background border, gradient fill, white monospace-like initials."

theme_mode:
  default: "light"
  toggle: "system-preferred via .dark class variant"
  dark_adjustments:
    - "Accent surfaces soften to violet-900/20-30 washes instead of 100-level pastels."
    - "Borders become oklch(1 0 0 / 10%) hairlines rather than opaque greys."
    - "Gradient CTAs and pricing slab are unchanged - the brand gradient is the anchor in both modes."

tone:
  voice: "Confident, optimistic, builder-focused. First person plural and active verbs. No jargon."
  microcopy:
    - "'Build websites without limits.' - declaratives over promises."
    - "Badges use sentence-case title over uppercase (except 'MOST POPULAR')."
    - "Social proof lives one beat below CTAs: avatar cluster + 'Join 2,000+ creators already building with cmssy'."
---

# cmssy Marketing - Design System

## North star

cmssy is the marketing surface for an AI-powered page-builder CMS. The visual job is to feel **confident, technical, and a little luminous** without tipping into gamer-gradient maximalism. The aesthetic sits at the intersection of:

- **shadcn/Tailwind neutral foundation** - crisp whites, near-black text, oklch-driven token system, generous whitespace.
- **Electric violet-to-purple brand accent** - every CTA, every highlighted word, every ambient orb is some stop between violet-500 and purple-700.
- **Soft ambient motion** - pulsing color orbs behind hero, drifting shards on the 404, gentle backdrop blurs on the header. Never a carousel, never a parallax scroll.

The design has to read as **"templated but not generic."** The reader should believe a human-designed SaaS sits underneath, but also that they could swap the violet for teal and get a clean, defensible starter.

## Voice of the identity

| Attribute | Present as |
| --- | --- |
| Trustworthy | Hairline borders, legible body type, zero shadow on most surfaces. |
| Modern | oklch color space, Tailwind v4 `bg-linear-to-*` gradients, lucide icons. |
| Playful, not childish | Pulsing orbs, sparkle badges, rotating geometric shards - always at low opacity. |
| AI-native | Sparkle icon in badges, violet-to-purple gradient as the "magic" signal, glitch treatment on error states. |

## Color language

### The brand anchor

A single gradient carries the brand: **violet-600 (#7c3aed) -> purple-600 (#9333ea)**. Variations:

- **Linear horizontal** on buttons, pills, icon tiles, logo blocks, gradient-clip headings.
- **Linear diagonal (`to br`)** on hero background wash and the full-bleed CTA slab.
- **Three-stop looped** (`violet -> purple -> violet`) on display text fills, so it reads as a ribbon rather than a fade.
- **Hover state** always darkens one Tailwind step (600 -> 700) on both ends; never recolors.

Never introduce additional brand hues. Secondary moods come from **status pastels** (blue/emerald/amber/red/zinc) that sit only inside docs callouts and roadmap columns.

### Neutral foundation

The shadcn "neutral" base palette in oklch. Pure-grey ramp from `oklch(0.145 0 0)` at foreground to `oklch(1 0 0)` at background, with `oklch(0.922 0 0)` for borders and `oklch(0.556 0 0)` for muted text. The dark theme is an honest inversion - card surfaces lift to `oklch(0.205 0 0)` and borders become translucent whites so soft surfaces still read on pure black.

Section rhythm alternates between **background** and `bg-slate-50/50` (dark: `bg-slate-900/50`). That tiny 50% opacity is the entire trick - it reads as a whisper of separation without creating a hard edge.

### Status and semantic

Docs callouts and roadmap columns use a **five-flavor status palette**. Always paired: pale tinted background, saturated icon, matching border.

- `info` - blue
- `tip` - emerald
- `warning` - amber
- `danger` - red
- `note` - zinc

## Typography

There is no web font. The system font stack (`system-ui, -apple-system, 'Segoe UI', Roboto, ...`) is the entire identity, which is deliberate: it renders natively, feels OS-correct on every platform, and stays out of the way of the color system.

Hierarchy:

- **Display (48-72px, 700, tracking -0.025em)** - hero headline. Always two-line: neutral phrase, `<br>`, gradient-clipped phrase.
- **Section head (30-36px, 700)** - same split pattern: `"Heading"` + gradient span on `{headingHighlight}`.
- **Lead (18-20px, 400, leading 1.625, muted-foreground)** - paragraph under section heads.
- **Body (14-16px, 400, muted-foreground)** - everything else.
- **Caption / badge (12-14px, 500-600, uppercase on mobile nav section titles only)**.
- **Ultra-display (clamp 128-256px, 900, tracking -0.05em)** - reserved for the 404 glitch number.

The gradient-clipped highlight phrase is load-bearing. It's how a visitor identifies the brand at a glance. Don't gradient-clip body copy or nav links.

## Spacing and rhythm

- Universal container: `max-w-80rem` (1280px) with responsive gutters (1 -> 1.5 -> 2rem).
- Universal section rhythm: **`py-24` (96px top/bottom)**. Hero is the exception - `min-h-screen`.
- Grid gutters: 1.5rem (24px) for feature cards; 2rem (32px) for pricing; 1rem (16px) for mega-menu children.
- Vertical spacing between hero elements: badge 32px -> headline 24px -> lead 40px -> CTA 40-64px -> social proof 16px -> media 48-80px.

The result is **air-heavy** but evenly cadenced. Nothing is cramped, nothing is theatrical.

## Shape language

- **Corner radii cluster in three bands:** `rounded-md` (0.5rem) for controls, `rounded-xl` (0.75rem) for dropdowns/hero media, `rounded-2xl` (1rem) for cards and shards. The CTA slab goes `rounded-3xl` (1.5rem) to signal a distinct full-bleed zone.
- **Pills are `rounded-full`** - badges, avatar dots, popular ribbon, ping rings.
- **Hairlines everywhere** - 1px borders in `border` token for all card edges, with translucent whites in dark mode.

## Elevation

The product uses **light-touch elevation**:

- Cards at rest: no shadow, only border. On hover: `shadow-lg`.
- Primary CTAs get a **violet-tinted glow** (`shadow-lg shadow-violet-500/25`) - never a neutral drop. The popular pricing card and hero media get the same halo family in `/10`, `/25`, `/30` variants.
- The scrolled header swaps `bg-background` for `bg-background/95 backdrop-blur-lg` with a `shadow-sm` - a barely-there lift that signals "stickied."

Glows are always violet. Neutral shadows are reserved for the hero media shell at `shadow-2xl`.

## Motion

Three tempos:

1. **Interaction (150-300ms, ease-out)** - hover lifts, chevron rotations, accordion expand, dropdown fade-in. Dropdowns fade *out* on a 150ms delay to forgive mouse arcs.
2. **Ambient (3-9s, infinite)** - orb pulses with staggered 1s offsets, shard drifts, radar pings on the 404. All at very low opacity so they register as depth, not animation.
3. **Glitch/scanline (4-8s, linear)** - only on the 404 page. A dual-layer `clip-path` glitch on the gradient number plus a vertical scanline sweep at 0.015 opacity. It's the single "edgy" moment in the whole system.

No slide-in scroll reveals. No parallax. No cursor-chasers. The design assumes content speaks for itself once it's on screen.

## Components - how they carry the identity

**Primary button** - Gradient fill, white text, violet halo, `rounded-md`. Hover darkens the gradient. At hero scale, height jumps to 48-56px with 24-32px horizontal padding; the arrow icon sits in the button's right-side `gap-2`. This shape is repeated on every page as the brand's handshake.

**Pill badge** - 40px tall, `rounded-full`, violet-100 bg on light / violet-900/30 on dark, sparkle icon on the left. Introduces every hero and most section heads. It's the "eyebrow" of the whole design.

**Feature card** - `rounded-2xl` background card with a 48px violet icon tile (white-stroke lucide icon inside). Hover: `shadow-lg` and a subtle 3% tint wash from the card's author-defined accent hex.

**Pricing card** - Neutral plain cards flanking a popular plan that breaks the row by:
  1. Swapping to the full brand gradient background.
  2. Scaling to 1.05x.
  3. Adopting `shadow-xl shadow-violet-500/25`.
  4. Flying an amber ribbon above it.

It's a decisive, almost theatrical hierarchy - the central plan *is* the poster child.

**Mega-menu dropdown** - `rounded-xl`, `bg-background/95 backdrop-blur-lg`, `shadow-lg`. Each child link has a 32px violet icon chip that flips to a solid violet background with a white icon on group-hover.

**CTA slab** - `rounded-3xl`, full violet gradient, 10%-opacity SVG plus-pattern overlay, three decorative white/10 geometric shards, centered copy on top. Primary button turns white with violet text; secondary button uses the `bg-white/10 border-white/30` ghost treatment. This block is the visual climax of most long pages.

**404** - The one place the system departs: giant gradient number with chromatic-aberration glitch, four radial ping rings, five drifting violet shards, a vertical scanline. Still violet-led, but theatrical.

## Dark mode posture

Dark mode is a first-class inversion, not an afterthought:

- Backgrounds bottom-out at `oklch(0.145 0 0)` - a warm near-black, not pitch black.
- Accent surfaces (the violet-100 badge, the icon chip, the accordion open-state) become `violet-900/20-30` translucent washes over card.
- Borders become `oklch(1 0 0 / 10%)` hairlines - they read as "this edge exists" without ever feeling heavy.
- The brand gradient and the CTA slab do **not** change between modes. The point of the gradient is that it works equally against white and black.

## What this system is not

- Not a "lean startup" wireframe aesthetic - the ambient orbs and violet halos matter.
- Not a neobrutalist block layout - no hard shadows, no chunky borders, no clashing fills.
- Not a glassmorphism system - backdrop blurs are used sparingly (header, dropdown panels), not as a signature.
- Not a multi-brand palette - one gradient does all the brand work. Introducing a second accent color breaks the design.

## Rules of thumb for extending the system

1. **If a surface needs to say "click me," it gets the violet gradient.** Secondary actions go outline/ghost. Tertiary actions are underlined text.
2. **If a word needs to say "this is the point," it gets `bg-clip-text text-transparent` over the three-stop gradient.** Use it once per heading, never inside body copy.
3. **If a container needs to feel elevated, add a violet-tinted shadow, not a neutral drop shadow.**
4. **Ambient effects should live at <=10% opacity.** Orbs, shards, patterns all work because they never compete with content.
5. **Section rhythm is sacred.** `py-24`, alternating slate-50/50 wash, container max 80rem - don't break it without a reason (hero and full-bleed CTA are the only sanctioned exceptions).
