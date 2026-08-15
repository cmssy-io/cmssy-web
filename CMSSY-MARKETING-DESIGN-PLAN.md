# CMSSY Marketing Design Plan

Branch: `feature/marketing-redesign` · worktree `../cmssy-web-wt-marketing` · base `d9b2f4f`
Status: **proposal — awaiting approval. No production code changed yet.**

---

## 0. What I actually looked at

- **Live site**, Playwright, real captures at 375 / 768 / 1440 (`homepage`, full scroll). Page heights: 7248px @1440, 11154px @375.
- **Repo**: 36 blocks, `defineBlock` registry, `styles/main.css` token layer, `app/layout.tsx` font wiring, `DESIGN.md`, `docs/homepage-rebuild-spec.md`.
- **Live content model** via `mcp__cmssy__get_page` — homepage is `hero → code-tabs → ai-differentiator → two-audiences → features → comparison-table → pricing → faq → cta`, all copy localized to en/pl/de/fr/es.
- **References**, same rig: linear.app, vercel.com, resend.com, clerk.com, supabase.com, storyblok.com.
- **Motion docs** via Context7 (`/websites/motion_dev`) — `LazyMotion`/`m`, `useReducedMotion`, `useScroll` target/offset, native `ScrollTimeline` backing.

**Tooling reality check:** the Motion MCP and 21st.dev MCP are **not connected in this session** — only Context7 is. I grounded the motion plan in Context7's Motion docs instead. If you want the Motion MCP / `/motion audit` in the loop, it needs to be added to `.mcp.json` before Phase 3; everything below is authored so that an audit pass can only tighten it, not invalidate it.

---

## 1. The honest diagnosis

The site is **already better than its reputation**. The copy is genuinely good — honest, numbers-first, no trash-talk, real product claims. The palette (`ink #10141c` / `paper #fafaf8` / `elektryk #00a8f0`), the Space Grotesk + IBM Plex pairing, the `FIG 0.1 —` plate numbering and the inverted dark/light band rhythm add up to a real identity that is **not** generic-SaaS. That identity is the asset. It does not need replacing.

What is wrong is **execution and choreography**, not direction.

### 1.1 Weaknesses worth fixing (evidence, not vibes)

| # | Weakness | Evidence |
|---|---|---|
| **W1** | **The hero headline has a hole in it.** The rotating word types *and deletes*; for roughly 40% of the loop the middle line is empty, so the primary headline reads "Content edited by / ⬚ / A frontend you own." Caught in the very first 1440 capture. This is the single worst thing on the page — it degrades the most important 3 seconds. | `blocks/hero/Hero.tsx:39-68`, capture `w1440-00` |
| **W2** | **The product shot is small, grey and fake.** The editor mockup is a right-column card of placeholder bars on a dot grid. It reads as a wireframe. Linear, Supabase and Vercel all put the *real* product at 1.5–2× this scale. CMSSY has a genuinely interesting UI and is hiding it. | `blocks/hero/EditorMockup.tsx`, capture `w1440-00` |
| **W3** | **Hero motion is three unrelated loops on one 12s clock.** Blocks snap in (`hero-snap-in`), a dock chip spins in from −320° (`hero-dock`), a chat types (`hero-chat-in` + `hero-type`). Nothing causes anything else. It is decoration, and the −320° spin is the one gesture on the site that looks AI-generated. | `styles/main.css:42-130`, `EditorMockup.tsx:16-22` |
| **W4** | **~200px of dead dark space** under the hero mockup at 1440 — the section's `py-20 lg:py-28` plus a mockup that ends early. The hero neither fills the viewport nor crops deliberately; it just stops. | capture `w1440-00` |
| **W5** | **Alignment has no system.** hero / code-tabs / ai-differentiator / two-audiences / features are left-aligned; pricing / faq / cta are centred. Nothing motivates the switch. | captures `w1440-04..06` |
| **W6** | **The FIG system is applied inconsistently.** FAQ renders `7.0 — FAQ` (no `FIG`). The strongest ownable device on the site has a typo-level gap in it. | capture `w1440-06` |
| **W7** | **`code-tabs` has a fixed-height void.** The `@cmssy/next` snippet is 6 lines inside a ~400px panel, left-anchored in an 80rem container — about 40% of the block is empty. Code is the developer-credibility moment and it currently looks unfinished. | capture `w1440-01` |
| **W8** | **Zero scroll choreography.** Every section is fully painted before it enters. There is no rhythm, no sense of a document unfolding, nothing that says "someone designed the transitions." | full scroll, all widths |
| **W9** | **Mobile defects at 375**: the announcement-bar text collides with its own close button ("…MCP Server✕"); the code block overflows horizontally with no scroll affordance or fade. | captures `w375-00`, `w375-01` |
| **W10** | **`prefers-reduced-motion` is handled bluntly.** Two CSS rules kill `.hero-anim` / `.cta-anim` outright. It works, but it is not a motion *system* — new work would need a third, fourth rule. | `styles/main.css:173-186` |
| **W11 — not design, but live** | **Prices are missing from the homepage pricing block in production.** Markup renders `<div class="mt-6 flex items-baseline gap-2"></div>` — empty. The stored content also has a doubled `"price":"$$0"`. Fallout from the CMS-1213 "price only from the API table" work. | `curl https://www.cmssy.com/` |
| **W14 — truthfulness** | **The hero demonstrates a capability the product does not have.** The mockup shows *"add a testimonials section in German"* docking a "Kundenstimmen" block, captioned "no redeploy". **There is no `testimonials` block type** — adding one requires writing and deploying code. Live on cmssy.com now. Full verification and the fix in §5.0. | `list_block_types` (36 types, no testimonials); hero block content |
| **W12 — hygiene** | **`DESIGN.md` documents a design system that no longer exists** — 700 lines describing a violet/purple gradient identity with no web font. The real system is ink/elektryk with Space Grotesk. Anyone (human or AI) extending the site from this file will build the wrong thing. | `DESIGN.md` vs `styles/main.css` |
| **W13 — hygiene** | `framer-motion@12` is a dependency and **is imported nowhere**. Zero bundle cost today, but the current package name is `motion` (`motion/react`). | `package.json`, repo-wide grep |

### 1.2 What must be preserved

Explicitly not on the table for redesign:

- **The palette.** `ink` / `ink-deep` / `paper` / `wash` / `elektryk-300/500/700`. One accent, no second brand hue.
- **The inverted-band rhythm** — dark hero, light body, dark CTA. It is the page's spine.
- **The FIG plate numbering.** This is the most ownable device on the site. It should be applied *harder*, not softened.
- **Space Grotesk (display) + IBM Plex Sans (body) + IBM Plex Mono (data/labels).** The mono-for-metadata habit is a real differentiator against the reference set.
- **The dot grid** as texture — never as decoration-for-its-own-sake.
- **The copy voice**: honest, numeric, comparison table that concedes points. Do not let visual work dilute it.
- **The architecture**: `defineBlock` + `cmssy/blocks.ts` registry, every string a CMS field, five locales. Nothing hard-coded into components that today lives in content.
- **Container `80rem` + `py-24` rhythm**, and the existing `Container` / `FigEyebrow` primitives.

---

## 2. Design direction: "the living technical plate"

One sentence: **CMSSY's marketing site should read like a precisely-typeset engineering document that happens to be alive.**

That position is defensible because it is already half-built (FIG numbering, mono metadata, dot grid, honest tables) and because **none of the reference set occupies it**: Linear owns cinematic dark restraint, Vercel owns brutalist geometry, Resend owns luxury near-black, Clerk owns friendly light, Supabase owns terminal-green developer maximalism, Storyblok owns pastel CMS-marketing. The engineering-plate lane is open.

Three rules that follow from it, and that make the site un-AI-generatable:

1. **Every figure is numbered and captioned.** FIG plates get real captions, not just eyebrows. A product shot is a *plate*, with a number and a one-line mono caption stating what it demonstrates.
2. **Data is set in mono; prose is set in Plex; only claims are set in Space Grotesk.** No third register. This is why the site will not look like a template — templates use one font for everything and colour for emphasis.
3. **Motion is measurement, not decoration.** Something moves only when it is showing a value changing, a state settling, or a relationship between two surfaces. If it cannot be captioned, it is cut.

---

## 3. Site-wide motion language

A four-token system, small enough that every future block obeys it without thinking.

### 3.1 Tempos

| Tempo | Duration / spring | Used for | Rule |
|---|---|---|---|
| **Response** | 120–180ms, `ease-out` | hover, focus, tab switch, accordion chevron | Never blocks input. Colour and border only — no transforms on hover except the existing `-translate-y-0.5` card lift, which stays. |
| **Settle** | spring `{ stiffness: 260, damping: 30 }` (≈320ms visual) | element entering the viewport, panel opening, block reveal | Fires **once** per element. Never re-triggers on scroll-back. |
| **Sequence** | 2.5–9s, one shared clock | the hero beat, and nothing else above the fold elsewhere | Exactly **one** sequenced element per viewport, ever. Pauses when off-screen. |
| **Ambient** | ≥6s, ≤4% opacity delta | dot-grid drift, signal-line pulse | Must be invisible when you look straight at it. If you can *notice* it, it is too strong. |

### 3.2 Choreography rules

- **Only `transform` and `opacity` animate.** No animated `width`/`height`/`top`/`filter`. (The current `hero-type` animates `width` — replaced.)
- **Reveal distance is 12px, not 40px.** Long travel is the single clearest tell of a generated landing page.
- **Stagger is 40ms, max 5 children.** Beyond 5, the group reveals as one.
- **Sections do not reveal as slabs.** Only the *content* of a section reveals — headings and figures — never the band background, which would flash.
- **Nothing animates above the fold before paint.** The LCP element (the H1) is server-rendered, static, and never a motion target.
- **One scroll-linked effect on the whole site** (the hero's exit hand-off, §5). No parallax anywhere else.

### 3.3 Reduced motion

Replace the two blunt CSS overrides with a system:

- A single `useReducedMotion()` read at the top of each motion component (Context7-confirmed API), driving a shared `useMotionPreset()` helper that returns either the real preset or `{ initial: false, animate: final }`.
- Reduced motion means **jump to the final state**, never "no animation and an invisible element" — the current CSS gets this right and the new system must not regress it.
- The hero sequence in reduced-motion renders **the last frame of the beat** (the finished, published state), which is also the most legible frame.
- Keep a CSS `@media (prefers-reduced-motion: reduce)` backstop for anything not yet migrated.

### 3.4 Library

Migrate `framer-motion@12` → `motion@12` and import from `motion/react`. Same maintainers, same code, current package name. Import via **`LazyMotion` + `m` + `domAnimation`** (Context7: ~4.6kb sync core vs the full `motion` bundle). One `<LazyMotion>` provider mounted in the marketing layout, not per-block.

**Budget: ≤18kb gzipped of animation JS added across the whole site.** If a concept cannot fit, the concept loses.

---

## 4. Product storytelling — the opportunities

The page currently *asserts* the product. It should *demonstrate* it. Four concrete opportunities, in ROI order:

1. **The hero should show cmssy.com's own homepage inside the cmssy editor.** Today the mockup shows anonymous grey bars. Making the canvas render the *real* hero content in miniature — the actual headline, the actual FIG plate — turns a wireframe into a provable claim, and it is the one demo no competitor can copy without also being a CMS that ships its own marketing site. Cost: content, not architecture.
2. **Make "one content, three surfaces" visible instead of stated.** Editor, code and MCP are currently three separate sections (`hero`, `code-tabs`, `ai-differentiator`) that never touch. The hero should show one value changing across all three at once — that *is* the product thesis, and seeing it once beats reading it three times.
3. **`code-tabs` should show cause and effect, not a static file.** Same snippet, but the rendered result appears beside it. Fixes W7 (the void) and converts a credibility block into a demonstration.
4. **Add a `figure-plate` primitive** so any block can present a captioned, numbered product shot with consistent framing. This is what turns future screenshots/screencasts into a system instead of one-off images, and it's the reusable-block answer to `docs/homepage-rebuild-spec.md`'s Phase 2 backlog (`product-showcase`, `demo-video`).

---

## 5. Hero — three concepts

Constraints for all three: real React/DOM (no video rendering readable UI), all copy stays CMS fields, five locales, LCP element static, ≤18kb JS budget shared with the rest of the site.

**All three kill the delete phase of the rotating word (W1).** The word swaps with a 140ms crossfade + 4px rise, and — critically — the line reserves its width for the longest word so the headline never reflows. This is a prerequisite, not a concept.

---

### 5.0 Capability verification — what the hero is allowed to show

Checked against the live `cmssy.com` workspace (MCP), the block registry, the rendering route and the webhook log. Nothing below is inferred from the marketing copy.

| Claim in the beat | Verdict | Evidence |
|---|---|---|
| `add_block_to_page` exists, adds a block to a page draft, takes language-keyed content, supports insert position | ✅ **Real** | Live tool schema. Validates against the workspace block manifest and returns `blockWarnings` on an unknown type or field. |
| `update_block_content` exists and writes a **single locale** by merge | ✅ **Real** | Live tool schema: `content` is `{ de: { … } }`, `mode: "merge"` default. |
| `publish_page` exists as a **separate step** after the draft edit | ✅ **Real** | Live tool schema. So the page genuinely sits in a modified-draft state between the two calls — the chip flip in the beat is accurate, not dramatised. |
| German localization | ✅ **Real** | `get_site_config`: `enabledLanguages: [en, pl, de, fr, es]`, default `en`. The homepage already stores full `de` content for every block. |
| "Content-only change, the AI never touches your frontend code" | ✅ **Real** | No MCP tool writes repo files. The block manifest is the enforced boundary: the AI can only instantiate types the deployed code already exposes. |
| "No redeploy" — the change is live without a build | ✅ **Real, and stronger than claimed** | `app/[[...path]]/page.tsx` sets `revalidate = 3600` + `generateStaticParams`; `app/api/revalidate/route.ts` clears the content tag on `content.changed`. The workspace has that webhook **enabled and healthy**: `https://www.cmssy.com/api/revalidate`, last 8 deliveries all `success / 200`, sub-second. A publish is live in seconds, no build, no deploy. |
| The inspector shows real, typed fields for the selected block | ✅ **Real — and the current mockup is already accurate** | The mockup's inspector renders `Logo Text`, `Navigation Items · 5 items`, `Dropdown Columns · none/1/2/3 → 3`. Those are verbatim the `header` block's real schema (`logoText`, `navigation` repeater, `columns` select). Someone did their homework here; preserve it. |
| **"add a testimonials section"** | ❌ **NOT real** | **There is no `testimonials` block type.** `list_block_types` returns exactly 36 types and none is testimonials/quote/review/logo-wall. The instruction shown in the live hero today would fail with `blockWarnings: unknown block type`, or would first require a developer to write `blocks/testimonials/`, register it, and **deploy** — the precise opposite of the "content-only, no redeploy" caption sitting next to it. |

**This is the one thing the current hero gets wrong, and it is the worst possible thing to get wrong** — the mockup's single most prominent claim ("Kundenstimmen · testimonials · de" docking in with "no redeploy") demonstrates the one action that *does* need a redeploy. It is live on cmssy.com right now (`chatPrompt`, `mockupDockLabel`, `mockupDockTag`, `mockupDockSub` in the hero block's content). Fixing it is content-only.

**The fix: the beat uses `features`.**

Selection criteria and why the alternatives lose:

- **`features` ✅ chosen** — exists; 6 fields, **no relation fields**, so the whole block including its German copy is created by the two calls the beat shows; renders as a small card grid, which reads instantly as "a section appeared" at plate scale; and "add a features section" is a plausible marketing request.
- **`faq` ❌** — exists, but its `faqs` field is a `relation` to `model:faq-item` with `relationMode: "picked"`. Adding it would also mean creating and translating model records. The beat would be understating the work, which is its own kind of dishonesty.
- **`pricing` ⚠️** — exists and is relation-free, but `ai-differentiator` already uses it for the identical demo further down the page, and it is the block currently rendering empty prices in production (W11). Reserved.
- **`cta` ⚠️** — clean fallback if `features` proves visually too busy at plate scale; renders as a single slab.

Two smaller accuracy fixes while we are here:

- The mockup's pages panel tags **Pricing as `Draft`**, but `/pricing` is published. Either drop the tag or move it to a page that is genuinely unpublished (`/careers` and `/newsletter` are).
- The plate caption must say **"content-only change"** only for the block-instance case. If we ever demo a *new block type*, the honest caption is different — CMSSY has a real answer for it (`update_block_content` with `target: "devDraft"` → `promote_dev_draft`, an overlay explicitly "for block types not deployed yet"), but that story ends in a deploy and must never carry the "no redeploy" line.

**Standing rule for Phase 3: every string and every action in the hero must resolve to a real block type, a real MCP tool name and a real field key.** Before implementation the beat gets a live dry run — actually execute `add_block_to_page · features` + `update_block_content · de` + `publish_page` against a scratch page, confirm it succeeds without `blockWarnings`, then delete the scratch page. If the sequence does not run for real, it does not go in the hero.

---

### Concept A — "The Plate" *(restrained)*

**Core idea.** One oversized headline, one big honest product plate. Delete everything else.

**Story.** "This is a real tool, and here it is." Credibility through scale and precision rather than through sequence.

**Composition.** Headline block at ~72–96px occupying the top third, left-aligned, full container width — not a 50/50 split with the mockup. Below it, the editor surface goes near-full-bleed (container width, ~880px tall) and is **deliberately cropped by the fold**, so the page invites scroll. A `FIG 0.1` plate caption sits under it in mono: *"the cmssy editor, editing this page."* Kills W4 by construction — there is no dead space, the figure runs out of the viewport.

**Animation.** One Settle on load: the plate rises 12px and fades in as a whole, with its three regions (rail, canvas, inspector) staggered at 40ms. Then one Ambient: the selection outline on the currently-selected block breathes its border opacity between 60% and 100% over 6s. Nothing else moves, ever.

**Tech.** Motion `m` + `LazyMotion`. No new dependencies beyond the `motion` rename. Editor mockup gets container queries so it reconfigures on its own width.

**Desktop.** As above. At ≥1920 the plate caps at 1440px and the dot grid extends — the figure does not scale up into softness.

**Mobile (375).** Headline at `clamp(2rem, 9vw, 2.75rem)`. The plate shows **canvas only** — rail and inspector are dropped, not shrunk — and is cropped at the fold the same way. Same story, one channel.

**Complexity.** Low — 2–3 days including mockup rework.

**Performance.** Negligible. No sequencing, no scroll listener. LCP unaffected.

**Risks.** It is *safe*. Against Linear and Resend it reads as competent rather than memorable, and it does not demonstrate the AI/MCP story at all — that would fall entirely to `ai-differentiator` further down, which most visitors will not reach.

---

### Concept B — "Three Surfaces, One Content" *(distinctive)* ← **recommended**

**Core idea.** The hero is a single instrument panel showing **one content value simultaneously in three representations**: the visual editor (centre, dominant), the code that renders it (left edge, docked), and the MCP conversation (bottom-right, docked). One instruction plays through all three on **one shared clock**, and a thin elektryk signal line traces the value travelling between the surfaces.

**Story.** Website → visual editing → content change → developer/code → AI/MCP → result — told once, in six seconds, without a word of narration. Precisely the story the brief asks for, and precisely the thesis the page currently splits across three sections.

**The beat** (single timeline, ~7s, one loop then rest until re-entered). Every step below was verified against the live workspace and the SDK — see §5.0.

| t | What happens | Which surface |
|---|---|---|
| 0.0s | The plate is at rest, showing this page's real hero content. Status chip: `Published`. | all |
| 0.6s | An MCP instruction types in: *"add a features section in German"*. | AI |
| 1.9s | Three tool calls tick in sequence: `add_block_to_page · features` → `update_block_content · locale de` → `publish_page · /`. | AI |
| 2.2s | The status chip flips `Published → Draft changes`. | plate |
| 2.4s | The signal line travels from the AI panel to the editor canvas. | connective |
| 2.7s | A `features` block **docks** into the canvas — slides up 12px and settles. No spin. | editor |
| 3.2s | The inspector's field list gains that block's real fields (`heading`, `description`, `features[]`); one German value writes itself in. | editor |
| 3.9s | The signal line travels to the code strip; a `page.blocks[]` entry appears — **the code does not change, only the data**. | code |
| 4.6s | The chip flips `Draft changes → Published`, and the plate caption updates: *"content-only change · no redeploy"*. | plate |
| 5.4–7s | Hold on the finished state. | — |

The 3.9s beat is the whole argument: the *code stays still* while the *content moves*. That is "content-only writes, the AI never touches your frontend code" — shown, not claimed.

**Composition.** Not floating cards. The three surfaces are **docked to one chassis** with shared hairlines, like panels of one instrument — this is what stops it becoming the floating-card-overload failure mode. The headline sits above-left; the chassis occupies the right two-thirds on desktop and is cropped at the fold.

**Animation approach.** One `MotionValue` clock drives all three surfaces (not three independent CSS loops — the W3 fix). `useInView` pauses the clock off-screen. Transform/opacity only. The signal line is an SVG `pathLength` animation, which is GPU-cheap and reads as *measurement*, not glow.

**Tech.** Motion (`m`, `LazyMotion`, `useInView`, `useMotionValue`/`useTransform`), SVG, container queries. **No WebGL, no video, no Remotion, no Rive, no shaders.** Everything readable is real DOM, so all six strings stay CMS fields and localize.

**Desktop.** Full beat, three surfaces. At ≥1920 the chassis caps and gains breathing room rather than scaling.

**Mobile (375).** Explicitly a **different choreography, not a scale-down**: two surfaces only — the MCP strip and the editor canvas, stacked. The code strip collapses to a single mono line (`blocks[] +1`) that appears at the 3.9s beat. Beat count drops 6 → 4, duration ~5s, and it plays **once** on entry rather than looping. Same story, fewer channels.

**Complexity.** Medium-high — 5–7 days including the mockup rebuild and the mobile choreography.

**Performance.** One RAF-driven clock, paused off-screen and by reduced-motion, animating ~10 elements on transform/opacity. Well inside budget. The HTML for the final state is server-rendered, so LCP is the static headline and there is no layout shift when the clock starts.

**Risks.** (a) Art direction must be tight or it degrades into floating-card SaaS — mitigated by the single-chassis rule. (b) Six beats is a lot to read in seven seconds; needs a real timing pass in the browser, and a fallback of slowing to 9s. (c) The mockup becomes the most complex component in the repo — it must stay a self-contained block with typed props, not leak into shared components.

---

### Concept C — "The Assembly" *(ambitious / cinematic)*

**Core idea.** The hero opens as a **blueprint**: the page rendered as schematic outlines on the dot grid, dimensions annotated in mono, FIG plate framing. An instruction types; the blueprint **resolves into the real rendered page**, region by region. Then the frame pulls back and the rendered page is revealed to be **cmssy.com's own hero** — the page you are looking at. On scroll-out, the composition scrub-reverses back to schematic.

**Story.** "This site is the demo." Maximum brand memorability; the recursion is the payoff.

**Composition.** Full-viewport (`100svh`), single stage, no left/right split — the headline is *inside* the composition and becomes the real headline as the blueprint resolves.

**Animation.** Load sequence (~4s) then a scroll-linked reverse via `useScroll({ target, offset: ["start start", "end start"] })`, which Motion backs with native `ScrollTimeline` where available (Context7-confirmed hardware acceleration). Possibly a Remotion-authored ambient dust/light loop as a seamless background video — but only as atmosphere behind the DOM, never rendering UI or text.

**Tech.** Motion scroll-linked + SVG morph + optionally Remotion (build-time only, ships an MP4/WebM) or a lightweight shader. Each of those is a real tradeoff to justify separately.

**Desktop.** Full cinematic, scroll-scrubbed.

**Mobile.** Autoplay 3-beat version, **no scroll scrubbing** (scroll-linked transforms on mobile are where jank lives), no video layer.

**Complexity.** High — 10–14 days, and it is the kind of work that expands.

**Performance.** The real cost. Blueprint→render morph means either double-rendering the hero (DOM weight, hydration risk) or SVG masks (paint cost). A video layer adds 1–3MB and a poster-frame/LCP problem. Scroll-linked reverse risks jank on mid-range Android. The headline being *part of the animation* puts the LCP element inside a motion sequence — the thing §3.2 forbids.

**Risks.** (a) The recursion joke lands once and then costs 4 seconds on every subsequent visit. (b) Highest chance of reading as *effect* rather than *product*. (c) It is the concept most likely to be quietly cut down to Concept B halfway through, after paying for the ambition.

---

### Recommendation: **Concept B**, with one element of C and the discipline of A

**Why B.**

1. **It answers the actual brief.** The requested story — website → visual editing → content change → developer/code → AI/MCP → result — is B's beat sheet, literally. A tells a third of it; C tells it but buries it under spectacle.
2. **It is the argument the page can't otherwise make.** "The AI edits content, never your code" is CMSSY's sharpest claim and its hardest to believe. The 3.9s beat — content moves, code stays still — proves it in one second. No paragraph does that.
3. **Every pixel is real product.** No shaders, no video, no 3D. Everything a visitor reads is DOM, so it localizes into five languages, stays a CMS field, is accessible, and is honest — which matters for a site whose copy strategy is explicitly "no promises we can't keep."
4. **It fits the budget and the identity.** One clock, transform/opacity, ≤18kb, dark plate on dot grid with mono captions. It amplifies the technical-plate direction instead of importing someone else's visual language.
5. **Risk is bounded.** If the six-beat timing proves too dense in the browser, B degrades gracefully to A by cutting beats — a planned retreat, not a rewrite. C has no such retreat.

**What I take from C:** the "this page is the demo" proof — but delivered as B's canvas rendering *this page's real content*, plus a mono plate caption, rather than a cinematic pullback. Same payoff, 5% of the cost and none of the LCP risk.

**What I take from A:** its discipline — headline first at full width, plate cropped by the fold, and a hard cap of one sequenced element per viewport on the entire site.

**Explicitly rejected for now:** Remotion, Rive, AI-generated video, WebGL/shaders. None of them survives the "does this improve communication?" test here, and each adds weight or a poster-frame LCP problem to the page's most performance-sensitive region. Revisit only if a *later* section genuinely needs a cinematic loop.

---

## 6. Beyond the hero — restrained plan for the rest

Each item exists to fix a diagnosed weakness. Nothing here is redesign-for-its-own-sake.

| Item | Fixes | What |
|---|---|---|
| **`Section` primitive** | W5, W6 | One component owning band colour, `py-24` rhythm, FIG plate, heading, lead. Alignment becomes a prop with **left as the only default**; centring allowed only for `cta`. Guarantees `FIG` is never dropped again. |
| **`Reveal` primitive** | W8 | Client wrapper: 12px + fade, Settle spring, `once: true`, reduced-motion aware. Applied to section headings and figures only — never to band backgrounds. This is the entire site-wide scroll story. |
| **`FigurePlate` primitive** | W2, opportunity 4 | Numbered, captioned frame for any product shot: hairline, dot-grid ground, mono caption. Makes future screenshots a system. |
| **`code-tabs` rework** | W7 | Panel height follows content; the rendered result appears beside the snippet; mobile gets a horizontal-scroll fade affordance. |
| **Announcement bar** | W9 | Grid layout so text and close button cannot collide at 375. |
| **Alignment + eyebrow pass** | W5, W6 | pricing / faq migrate to the `Section` primitive; FAQ regains its `FIG 7.0`. |
| **`DESIGN.md` rewrite** | W12 | Replace the stale violet document with the real ink/elektryk system plus the motion language in §3. Cheap, and it is what stops the next contributor — human or model — from rebuilding a purple SaaS template. |
| **`motion` migration** | W13 | `framer-motion` → `motion`, `LazyMotion` provider in the marketing layout. |

**Shippable before any redesign:** **W14, the testimonials claim.** It is a content-only fix to the live hero block (`chatPrompt`, `mockupDockLabel`, `mockupDockTag`, `mockupDockSub`, ×5 locales) via MCP — no deploy, no branch. It can land today, independently of everything else in this plan, and it should.

**Not in scope, flagged for you:** **W11, the missing prices in production.** The homepage pricing block renders an empty price container and the stored content has a doubled `"price":"$$0"`. That is live, it is on the conversion path, and it belongs to the CMS-1213 pricing-from-API work another agent is holding. I have not touched it.

---

## 7. Responsive strategy

Fluid by default; breakpoints only where the *composition* changes, never to patch spacing.

- **Type**: a `clamp()` ramp as CSS variables in `@theme` — `--text-display`, `--text-h2`, `--text-lead`. Hero headline `clamp(2rem, 5.2vw, 5.5rem)`. Replaces today's per-block ad-hoc `text-[clamp(...)]`.
- **Rhythm**: `--section-y: clamp(4rem, 8vw, 7rem)` replacing the `py-24` / `py-20 lg:py-28` / `py-16 lg:py-24` drift found across blocks.
- **Container queries for the editor plate.** The mockup is an instrument that should reconfigure on **its own width**, not the viewport — so it behaves identically in the hero, in a future `product-showcase`, and inside the CMSSY editor's own preview frame. `@container` at ~520px (canvas only), ~760px (+ pages rail), ~1040px (+ inspector).
- **Grids**: `repeat(auto-fit, minmax(…, 1fr))` for feature/card grids instead of `sm:grid-cols-2 lg:grid-cols-3`, so 900–1100px stops being a dead zone.
- **Verification matrix, every batch**: 375 · 430 · 768 · 1024 · 1280 · 1440 · 1920 · 2560, plus a 375×667 short-viewport check (the hero must not require scrolling to reach the CTA).
- **`100svh` not `100vh`** anywhere the hero measures the viewport.

---

## 8. Performance considerations

- **Budget: ≤18kb gz animation JS site-wide**, via `LazyMotion` + `m` + `domAnimation`. Measured before/after, reported per batch.
- **LCP is the H1** — server-rendered, static, never a motion target, no font-swap jump (Space Grotesk already `next/font`, self-hosted).
- **Zero CLS**: the rotating word reserves the longest word's width; the hero plate reserves its aspect ratio; reveals animate `opacity`/`transform` only, never layout.
- **The hero sequence starts after first paint** and pauses via `useInView` when scrolled away — no RAF burning on an off-screen loop.
- **No new heavy dependencies.** WebGL, video, Rive and Remotion are all rejected for this phase (§5); if a later need appears, it comes with its own written justification per the brief.
- **Hydration**: the hero renders its *final* state on the server; the client only animates from that state. Prevents both the flash-of-unanimated-content and the hydration mismatches this repo has been bitten by before (`app/layout.tsx` comment).
- **Per batch**: Lighthouse mobile + desktop, a DevTools performance trace of the hero loop (target: no frame >16ms during the beat), and a check for dropped frames on 4× CPU throttle.

---

## 9. Execution order (after approval)

1. Foundations — `motion` migration, `LazyMotion` provider, `Reveal`, `Section`, type/rhythm tokens. Zero visual change except alignment consistency. *(verify: nothing regressed)*
2. Hero Concept B — mockup rebuilt as a container-query instrument rendering this page's real content; the beat; mobile choreography; reduced-motion. *(the big one)*
3. `code-tabs` rework + `FigurePlate`.
4. Cleanup — announcement bar, FAQ FIG, scroll-reveal pass, `DESIGN.md` rewrite.

Each batch: implement → run the site → browser check across the §7 matrix → reduced-motion → a11y → perf trace → refine before continuing.

---

## Unresolved questions

1. **Concept B approved, or A / C?**
2. **W14 (testimonials claim, live and false)** — fix the live hero content now via MCP, or wait and fold it into the redesign? Recommend now.
3. **Beat subject** — `features`, or prefer `cta` (simpler visual) / `pricing` (matches `ai-differentiator`)?
4. **Should a `testimonials` block actually get built?** The demo wanting it is a signal. If it existed, the original story would become true — but that is a code change, not this plan.
5. **Hero copy** — keep the rotating word (crossfade, no delete) or commit to one fixed headline?
6. **W11 (missing prices, live)** — should I fix it on this branch, or is it the other agent's?
7. **`DESIGN.md`** — rewrite in place, or new file and delete the old?
8. **Motion MCP / 21st.dev** — add to `.mcp.json` before Phase 3, or proceed on Context7 alone?
9. **New copy** for the hero beat's plate caption and code strip: I write it as CMS field defaults, or you supply it?
