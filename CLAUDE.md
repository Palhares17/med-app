# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MedBrain is an AI-powered medical study app (flashcards, quizzes, groups). The front-end lives in `front-end/`. All UI text is in Portuguese (pt-BR). Currently fully mocked — no backend API integration yet.

## Commands

All commands run from the `front-end/` directory using **pnpm**:

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build
pnpm lint         # ESLint (no args needed, uses eslint.config.mjs)
```

Add shadcn/ui components:
```bash
pnpm dlx shadcn@latest add <component>
```

## Architecture

```
front-end/src/
├── app/                    # Next.js 16 App Router
│   ├── (auth)/login/       # Public auth route
│   ├── (app)/              # Protected routes (auth guard in layout.tsx)
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── flashcards/     # List + [id] study session
│   │   ├── questoes/       # List + [id] quiz session
│   │   └── grupos/         # List + [id] group detail
│   ├── layout.tsx          # Root layout (fonts, dark theme, Sonner)
│   └── globals.css         # Tailwind v4 + CSS variables (OKLch)
├── core/                   # Shared code
│   ├── components/ui/      # shadcn/ui (new-york style)
│   ├── components/layout/  # Sidebar, Header, PageContainer
│   ├── components/shared/  # CreditBar, EmptyState, LoadingScreen
│   ├── components/animations/ # GSAP wrappers (FadeIn, SlideIn, StaggerChildren)
│   ├── hooks/              # useAuth, useCredits
│   ├── entities/           # TypeScript interfaces (User, Flashcard, Question, etc.)
│   ├── types/              # Shared types (SortOptions, AsyncStatus, etc.)
│   ├── constants/          # Routes, credit limits, upload limits, storage keys
│   ├── mocks/              # Mock data for all entities
│   └── lib/utils.ts        # cn() — clsx + tailwind-merge
└── features/               # Feature modules
    └── <feature>/
        ├── types/          # Feature-specific types
        └── views/          # Page components + sub-components
```

## Key Conventions

- **Import alias:** `@/*` maps to `./src/*`
- **shadcn/ui aliases:** components → `@/core/components`, ui → `@/core/components/ui`, hooks → `@/core/hooks`, lib → `@/core/lib`
- **Route constants:** Use `ROUTES` from `@/core/constants` — never hardcode paths
- **Auth:** localStorage-based (`"projeto-o:user"` key), guarded in `(app)/layout.tsx`
- **Theme:** Dark by default, light via `.light` class. Colors use OKLch CSS variables
- **Animations:** GSAP with `useGSAP` hook from `@gsap/react`; use wrapper components from `core/components/animations/`
- **Forms:** React Hook Form + Zod validation
- **Toasts:** Sonner (`toast()` / `toast.success()` / `toast.error()`)
- **Feature pages:** Each feature exports a `*Page` component from `views/`, rendered by the App Router `page.tsx`
