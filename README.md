# TurboTune

Next.js scaffold for an LLM fine-tuning platform concept. Work in progress.

## What's Here

This is a bare Next.js starter with Supabase wiring. The repo contains:

- A single root page (page.tsx), layout, and global styles
- Supabase client configuration (lib/supabase)
- Project configuration files (tsconfig, tailwind, postcss, next.config)

No UI components, dashboard pages, or fine-tuning functionality have been implemented yet.

## Tech Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (with SSR support)
- Zustand, Recharts, Lucide React (listed in package.json but not yet used in code)

## Status

Early-stage scaffold generated with AI assistance. No fine-tuning features, training dashboards, or dataset tools are implemented. The project structure is minimal - just the default Next.js app entry point and Supabase client setup.

## Setup

```bash
npm install
npm run dev
```

Requires Supabase credentials in .env.local. See .env.local for required variables.
