---
meta:
  name: cmssy Marketing Design System
  description: Ink-and-elektryk instrument aesthetic for a developer-facing headless CMS. Flat inverted bands, one saturated accent, geometric display type over a humanist body face, and a four-tempo motion language.
  color_space: hex + oklch (semantic tokens)
  mode: light-first, dark-parity
  base_palette: neutral

color:
  brand:
    elektryk:
      value: "#00a8f0"
      token: --color-elektryk-500 (aliased --color-elektryk)
      role: The single accent. Primary buttons, the live dot in a FIG plate, active tab underline, the one highlighted word in a heading, the docking square in the mark.
    elektryk_300:
      value: "#5bc6f7"
      role: Accent on ink. Used where elektryk-500 would not clear contrast on a dark band.
    elektryk_700:
      value: "#0077b6"
      role: Accent on paper. Stat lines, highlighted heading words, the cmssy column in the comparison table.
  ground:
    ink:
      value: "#10141c"
      role: The dark band. Hero, AI differentiator, CTA, the developer card, every code chassis.
    ink_deep:
      value: "#0b0e15"
      role: One step below ink. Panels inset into an ink surface, so a chassis reads as one object with recessed parts.
    paper:
      value: "#fafaf8"
      role: Foreground text and marks on ink. Warm, not pure white.
    wash:
      value: "#f1f0ec"
      role: Reserved warm light band. The theme-following `bg-muted` is used instead wherever the band must invert in dark mode.
  semantic:
    note: >-
      background / foreground / card / muted / muted-foreground / border are
      shadcn-style oklch tokens in :root and flipped under html[data-theme="dark"].
      Anything that must follow the theme uses these. ink / paper / elektryk are
      literal and theme-independent by design - an inverted band is a
      composition decision, not a consequence of the theme.
  forbidden:
    - Gradients as brand identity. One radial hero bloom at 16% opacity is the entire budget.
    - A second accent hue. Amber appears only as a state colour (unpublished changes) inside the hero instrument.
    - Purple, violet, indigo. The previous system's signature; removed.

typography:
  heading:
    family: Space Grotesk (--font-heading)
    role: Geometric, slightly mechanical. Display and section headings only.
  body:
    family: IBM Plex Sans (--font-sans)
    role: Everything a visitor reads in sentences.
  mono:
    family: IBM Plex Mono (--font-mono)
    role: >-
      Load-bearing, not decorative. Code, tool names, field labels, FIG plates,
      stat lines, captions. Mono is how the site says "this is a real value".
  scale:
    text-display: clamp(2rem, 5.2vw, 5.5rem) / 1.04 / -0.03em
    text-h2: clamp(1.75rem, 3.2vw, 3rem) / 1.1 / -0.02em
    text-h3: clamp(1.25rem, 1.8vw, 1.75rem) / 1.2 / -0.01em
    text-lead: clamp(1.0625rem, 1.2vw, 1.25rem) / 1.6
    rule: >-
      One fluid ramp for the whole site. A block that needs a size not on the
      ramp is a design decision, not an implementation detail.

spacing:
  section: clamp(4rem, 8vw, 7rem)
  section_tight: clamp(2.5rem, 5vw, 4rem)
  rule: Every band uses py-section (or py-section-tight). No per-block py-16 lg:py-24 improvisation.

shape:
  radius: --radius 0.625rem, with rounded-2xl on cards and rounded-[14px] on code chassis
  hairline: 1px borders at border-border on paper, white/8-white/10 on ink
  dot_grid: 24px radial dot grid, 7% paper on ink and 8% ink on paper. The ground of every figure.
  squares: >-
    2.5px rounded-[3px] squares, not circles. They are the mark's own geometry
    and appear as bullets, tab dots and status pips.

motion:
  tempos:
    response: 0.16s - something the visitor just did. Must feel instant.
    settle: spring stiffness 260 damping 30 - something arriving on its own. The site's default.
    sequence: 0.42s - a narrated beat. Only the hero is allowed one.
    ambient: 6s+ loops at low amplitude. Background life only.
  reveal:
    distance: 12px
    stagger: 40ms, capped at 5 children
    scope: Section headings and figures only. Never a band background.
    properties: transform and opacity only.
  reduced_motion: >-
    Every animated surface renders its finished state. The hero clock never
    starts and reports the last stage, which is also the most legible frame.
    Nothing is ever left invisible.
---

# cmssy Marketing - Design System

## North star

cmssy is a headless CMS with an MCP server. The site's job is to be believed by
a developer in ten seconds, so the design behaves like an instrument rather than
a brochure: flat surfaces, hairlines, monospaced labels, real values.

The homepage argues one thing - **content changes without a redeploy** - and
every figure on it is a real capability that was executed against a live
workspace before it was drawn.

## Voice of the identity

Precise, plain, unhurried. Nothing exclaims. The strongest gesture available is
a single elektryk word in an otherwise black heading, or a `✓` next to a real
tool name.

## Color language

One accent, two grounds. `elektryk` is the only hue on the site; `ink` and
`paper` are the two bands it lives on. Inverted bands are the primary rhythm
device: ink hero → paper code surface → ink differentiator → paper product →
muted features → paper comparison → paper pricing → paper FAQ → ink CTA.

`ink` and `paper` stay literal in both themes. Everything that must follow the
theme (`bg-background`, `bg-card`, `bg-muted`, `text-muted-foreground`,
`border-border`) uses the semantic tokens.

Amber (`#f5b544`-range, expressed inline) appears in exactly one place: the
hero chassis status chip while the page has unpublished changes. It is a state,
not a brand colour.

## Typography

Space Grotesk carries the headings, IBM Plex Sans the prose, IBM Plex Mono
everything that is a value. The mono is the tell: field names, tool calls,
HTTP status, block types and FIG plates are all set in it, so a reader can see
at a glance which parts of the page are claims and which are data.

Headings use the shared `text-display` / `text-h2` / `text-h3` steps. Leads use
`text-lead`. Card titles stay at `text-lg` - a card title on the h3 step reads
as a section heading and flattens the hierarchy.

## The FIG plate

Every section opens with a monospaced plate: `FIG 4.0 — BUILT IN, NOT BOLTED ON`.
It is the most ownable device on the site. The `FIG` prefix is enforced in
`FigEyebrow`, not trusted to the editor in every locale, because a section that
shows a bare `7.0` breaks the whole conceit.

The pill variant (a bordered capsule with a live dot) is reserved for the hero.

## Spacing and rhythm

`py-section` on every band, `py-section-tight` where two bands must read as one
movement. The `Section` primitive owns band, padding, container, header stack
and reveal ordering, so alignment and eyebrow treatment cannot drift block by
block.

Section headers are left-aligned. The closing CTA is the single deliberate
exception; it is centred because it is a statement, not a shelf of content.

## Shape and elevation

Hairlines over shadows. Cards get a 1px border and, at most, a long soft shadow
under a code chassis (`0 30px 60px -30px`) to lift it off the paper band.
Nothing floats: the AI panel is docked into the hero chassis rather than
hovering over it, because a floating card is the generic-SaaS gesture this
system exists to avoid.

## Motion

Four tempos, listed in the front matter. A component that needs a fifth is a
design decision.

- **Response** - tab switches, hover states.
- **Settle** - the site-wide `Reveal`: 12px and a fade, once, on enter.
- **Sequence** - the hero beat only. One clock (`useBeatClock`) owns nine
  stages; every surface is a pure function of the stage, which is why the
  sequence can argue something instead of three loops running independently.
- **Ambient** - the CTA mark's docking loop.

Scroll motion is deliberately thin: heads and figures move 12px, band
backgrounds never do. Under `prefers-reduced-motion` every surface renders its
final state.

## Responsive posture

Container queries, not viewport queries, wherever a component can appear at
different widths. The hero chassis decides which of its panels exist from its
own width (`@xl` rail, `@2xl` inspector, `@4xl` page list), so the same
component is correct in a narrow column and across a 1920 page.

Below `xl` the hero headline runs full width and the chassis is cropped by the
fold; from `xl` the chassis earns its own column. Below `sm` the beat plays a
shorter, non-looping story - a loop within a thumb's reach is a distraction.

Anything wider than its column scrolls inside itself via `ScrollHint`, which
fades the cut edge only while there is genuinely something past it. The page
body never scrolls horizontally at any width from 375 to 2560.

## Dark mode posture

The theme flips the semantic tokens only. Ink bands stay ink, paper text stays
paper, elektryk stays elektryk. A dark-theme visitor sees the same composition
with the light bands darkened, not a different design.

## What this system is not

- Not gradient-led. There is one radial bloom in the hero at 16% opacity.
- Not glassmorphic. No blurs, no translucent floating panels.
- Not icon-driven. Squares, hairlines and monospaced labels do that work.
- Not animated on scroll as a whole. Sections do not fade in; their headings do.

## Rules of thumb for extending the system

1. If a figure implies a product capability, execute it against a live
   workspace first. Nothing on this site may depict an action cmssy cannot
   perform.
2. Reach for `Section` before writing a new band. Reach for `Reveal` before
   writing a new animation.
3. Values go in mono. Prose goes in Plex Sans. Headings go in Space Grotesk.
4. New size, new tempo or new hue means editing this document first.
