# cmssy-marketing

A headless Next.js (App Router) site that fetches **published** content from the
cmssy public delivery API and renders it with local block components - no
`cmssy build`/publish step and no CLI.

## Headless frontend

Built on the `@cmssy/next` + `@cmssy/react` SDK (vendored in `vendor/`).

```bash
pnpm install
pnpm dev            # next dev   -> http://localhost:3000
pnpm build          # next build
pnpm start          # next start
```

Architecture:

- `cmssy/config.ts` - SDK config from env (`CMSSY_API_URL` is the full GraphQL
  endpoint, `CMSSY_WORKSPACE_SLUG`, draft/editor settings) + `resolveLocale`.
- `cmssy/blocks.ts` - block registry: imports each `blocks/*/block.ts`
  (`defineBlock(...)` + `fields` from `@cmssy/react`) and exports them. Add a new
  block by registering it here.
- `app/[[...path]]/page.tsx` - single catch-all via `createCmssyPage`. A leading
  non-default locale segment (`/pl/...`) is stripped before querying cmssy; the
  active locale comes from the `x-cmssy-locale` header. `app/layout.tsx` renders
  header/footer via `CmssyServerLayout`.
- `cmssy/metadata.ts` - per-page SEO (`generateMetadata` queries `publicPage` for
  `seoTitle`/`seoDescription`/`seoKeywords`, localized).
- `proxy.ts` - sets the locale header (`/pl/*` -> pl) and edit-mode CSP.
- `app/api/draft` - editor draft bridge; `app/api/revalidate` - on-demand ISR
  webhook (guarded by `CMSSY_REVALIDATE_SECRET`).
- `app/api/graphql` + `app/api/public-graphql` - proxy the public delivery API for
  client blocks (blog-posts listing, contact form). The proxy adds the
  `x-workspace-id` header that workspace-scoped queries (e.g. `publicForm`) need.
- Dynamic blocks fetch client-side via these proxies using
  `NEXT_PUBLIC_CMSSY_WORKSPACE_ID` (the SDK passes blocks only `{ content }`, no
  platform context).

Copy `.env.example` to `.env` and fill in the values.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server (defaults to http://localhost:3000)
pnpm dev

# Build for production
pnpm build
```

## Block authoring (headless SDK)

Blocks are plain React components consumed directly via the cmssy SDK
(`@cmssy/next` + `@cmssy/react`) - there is no build/publish step and no CLI.

Each block lives under `blocks/<name>/`:

- `src/<Name>.tsx` + `src/index.tsx` - the React component
- `src/block.d.ts` - the `BlockContent` content type the component consumes
- `block.ts` - the `defineBlock(...)` wrapper (`@cmssy/react` `fields`) that
  registers the block's editor schema

Register the block by adding it to `cmssy/blocks.ts`. The page route
(`app/[[...path]]/page.tsx`) renders pages with
`createCmssyPage(cmssy, blocks, { editor: CmssyEditor })`; the SDK loads each
block as a component at runtime - nothing is bundled into `public/`.

## Project Structure

```
cmssy-marketing/
├── app/                 # Next.js App Router (page route + proxy)
├── blocks/              # UI blocks (plain React components)
│   └── hero/
│       ├── src/
│       │   ├── index.tsx
│       │   ├── Hero.tsx
│       │   ├── block.d.ts   # BlockContent type
│       │   └── index.css
│       └── block.ts         # defineBlock(...) registration
├── cmssy/               # SDK wiring (blocks registry, editor)
├── components/          # Shared UI
├── vendor/              # Vendored @cmssy/* SDK tarballs
├── .env                 # API credentials
└── .env.example         # API credentials template
```

## Documentation

For more information, visit: https://cmssy.io/docs
