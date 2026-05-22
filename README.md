# cmssy-marketing

Cmssy project for building reusable UI blocks and templates.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server with hot reload (defaults to http://localhost:3000)
npm run dev

# Or specify a custom port
cmssy dev -p 3002

# Create a new block
cmssy create block my-block

# Build for production
npm run build
```

## Available Commands

### Development

```bash
# Start dev server with preview UI (uses npm script)
npm run dev

# Create a new block
cmssy create block <name>

# Create a new page template
cmssy create template <name>

# Build all blocks and templates (uses npm script)
npm run build
```

### Publishing

```bash
# Configure API credentials (run once)
cmssy configure

# RECOMMENDED: sandbox build pipeline (CMS-576)
cmssy publish-block hero -w ws_abc123            # single block
cmssy publish-block header --dry-run             # see source archive plan

# Auto-walks shared imports (../../components/*, ../../lib/*, @/* aliases),
# runs the build in an isolated Vercel Sandbox, writes server + client
# bundles to Vercel Blob, and revalidates the public-site cache.
```

> ⚠ The legacy `cmssy publish` command is deprecated (CMS-599) and
> will be removed in a future release. It only ships the client
> bundle and skips shared-import auto-walking, so blocks like
> `header` (which imports `../../components/container`) won't build
> through the sandbox pipeline without explicit migration. Use
> `publish-block` for all new work.

### Syncing from Marketplace

```bash
# Pull a specific block from marketplace
cmssy sync @vendor/blocks.hero --workspace ws_abc123

# Pull all installed packages
cmssy sync --workspace ws_abc123
```

## Project Structure

```
cmssy-marketing/
├── blocks/              # Your UI blocks
│   └── hero/
│       ├── src/
│       │   ├── index.tsx
│       │   ├── Hero.tsx
│       │   └── index.css
│       ├── package.json
│       └── preview.json
├── templates/           # Your page templates
├── public/              # Build output
├── cmssy.config.js      # Project configuration
├── .env                 # API credentials (created by configure)
└── .env.example         # API credentials template
```

## Configuration

Edit `cmssy.config.js` to customize:

- Framework (react)
- Author information
- Build settings

## Framework

- react

## Author

-

## Documentation

For more information, visit: https://cmssy.io/docs
