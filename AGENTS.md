# AGENTS.md

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is a Next.js 16 web application (Cosmic Chat) that connects to AI backends (Ollama, OpenAI, OpenWebUI) via Cloudflare Workers. It uses React 19, TypeScript, and Tailwind CSS v4.

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start Next.js dev server on localhost:3000

# Production
npm run build            # Build Next.js app for production
npm run start            # Start production server (after build)

# Linting
npm run lint             # Run ESLint with next/typescript rules

# Type checking
npm run check            # Run build + TypeScript type check (tsc --noEmit)

# Cloudflare deployment (requires Wrangler)
npm run cf-typegen       # Generate Cloudflare env types
npm run preview          # Preview on Cloudflare Workers
npm run deploy           # Deploy to Cloudflare Workers

# Deployment flow: build -> opennextjs-cloudflare deploy
```

### Single Test Commands

No test framework is currently configured. If adding tests:
- Install Vitest for unit tests: `npm install -D vitest`
- Install Playwright for e2e: `npm install -D @playwright/test`

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** in tsconfig.json - no implicit any, strict null checks
- Use explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/primitives
- Error handling pattern: `error instanceof Error ? error.message : 'Unknown error'`

```typescript
// Good
interface ChatContainerProps {
  onOpenSettings: () => void;
}

// Error handling
try {
  // ...
} catch (err) {
  return { error: err instanceof Error ? err.message : 'Unknown error' };
}
```

### React Components

- Use function components exclusively with PascalCase names
- Mark client components with `'use client'` directive at top of file
- Server components should NOT have `'use client'`
- Use `dynamic()` with `{ ssr: false }` for client-only components that need browser APIs
- Prop interfaces are named `{ComponentName}Props`

```typescript
'use client';

import { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  // ...
}
```

### Imports

- Use path alias `@/` for imports from `src/` directory
- Order: external packages -> internal packages -> relative imports
- Use `import type` for type-only imports when possible

```typescript
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import SettingsModal from '@/components/SettingsModal';
import { useSettings, Message } from '@/components/SettingsContext';
```

### File Naming

- React components: PascalCase (`ChatContainer.tsx`)
- Utils/hooks: camelCase (`useSettings.ts`)
- API routes: kebab-case (`/api/chat/route.ts`)
- Config files: kebab-case or dot-prefixed (`eslint.config.mjs`)

### Tailwind CSS

- Use Tailwind CSS v4 with `@tailwindcss/postcss`
- Custom colors defined in `globals.css` as CSS variables
- Use Tailwind's responsive prefixes (`lg:`, `md:`) for breakpoints
- Mobile-first approach - default styles for mobile, `lg:` for desktop

```tsx
<div className="flex h-screen lg:relative">
  <button className="p-2 rounded-md hover:bg-slate-700/50" />
</div>
```

### CSS Conventions

- Use Tailwind utilities as primary styling method
- Custom CSS in `src/app/globals.css` for complex effects
- CSS variables defined under `:root` for theming
- Use `glass-card` class for backdrop-blur cards
- Use `-webkit-` prefixes for webkit-only properties (text-fill-color, app-region)

### Next.js Conventions

- App Router structure: `src/app/[route]/page.tsx` and `route.ts`
- API routes use edge runtime when streaming: `export const runtime = 'edge'`
- Metadata exported from `layout.tsx` for SEO
- Use `generateMetadata()` for dynamic metadata

### API Routes

```typescript
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // ...
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Naming Conventions

- Components: PascalCase
- Functions/Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase
- File names: match component/function name (PascalCase for components)
- CSS classes: kebab-case (Tailwind utilities)

### Patterns

- Use Context API for global state (`SettingsContext.tsx`)
- Custom hooks for reusable logic
- Prefer `useCallback`/`useMemo` for expensive computations
- Use `ref` for DOM access and scroll management
- Streaming responses use ReadableStream pattern shown in `api/chat/route.ts`

### Accessibility

- Use semantic HTML elements (`<main>`, `<nav>`, `<button>`)
- Include `aria-label` on icon-only buttons
- Use `role` attributes when semantic HTML isn't sufficient

### File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/route.ts  # Edge runtime chat proxy
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles + Tailwind
├── components/            # React components
│   ├── *.tsx              # Client/server components
│   └── *Context.tsx       # Context providers
└── types/                 # Shared TypeScript types (if needed)
```

## Development Notes

- Uses Bun as package manager (bun.lock present)
- Cloudflare Workers deployment via `@opennextjs/cloudflare`
- Environment variables in `env.d.ts`
- No testing framework currently configured
