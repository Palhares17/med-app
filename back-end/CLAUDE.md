# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MedBrain back-end API: **Fastify 5 + TypeScript + Drizzle ORM + PostgreSQL 16**, with Zod-driven validation and auto-generated OpenAPI (Swagger UI at `/docs`). Package manager is **pnpm 10**; run all commands from `back-end/`.

This is an **architecture skeleton** — the `users` module is a reference example, not real product features. When adding a domain, replicate its layering exactly (see below).

## Commands

- `docker compose up -d` — start Postgres (port 5432) **before** `pnpm dev`; without it the app fails with `ECONNREFUSED 127.0.0.1:5432`.
- `pnpm dev` — tsx watch server on `http://localhost:3333` (Swagger at `/docs`).
- `pnpm db:generate` — generate a migration from `src/db/schema.ts` into `./drizzle`.
- `pnpm db:migrage` — apply migrations. **Note the typo** — the script is literally `db:migrage`, not `db:migrate`.
- `pnpm db:push` — push schema directly without a migration file.
- `pnpm build` (tsc) → `pnpm start` (`node dist/server.js`).
- **Lint:** there is no `pnpm lint` script. Run `pnpm eslint .` (ESLint 10 flat config in `eslint.config.mjs`).
- **Tests:** none set up yet. Use Node's built-in runner: `node --import tsx --test src/**/*.test.ts`.

## Module architecture (the convention to follow)

Each domain lives in `src/modules/<name>/` and is split into six layered files (see `src/modules/users/`):

- `<name>.schema.ts` — Zod schemas + `z.infer` types for bodies/responses.
- `<name>.repository.ts` — Drizzle data access. `constructor(private db: Database)` (`Database` type from `src/plugins/db.plugin.ts`).
- `<name>.service.ts` — business logic. `constructor(private repository)`.
- `<name>.controller.ts` — Fastify handlers as **arrow-function class properties** (so `this` survives when passed directly as route handlers). `constructor(private service)`.
- `<name>.plugin.ts` — `fp()` plugin: instantiates repository → service → controller, `app.decorate("<name>", {...})`, augments `FastifyInstance` via `declare module "fastify"`, and sets `dependencies: ["db-plugin"]`.
- `<name>.router.ts` — `FastifyPluginAsyncZod`; routes carry a Zod `schema` (`tags`/`summary`/`body`/`response`) and call `app.<name>.controller.<handler>`.

Wire into `src/app.ts` **in this order**: `app.register(<name>Plugin)` first (injects services), then `app.register(<name>Routes, { prefix: "/<name>" })`. Shared infra (`dbPlugin`) is registered before any module.

## Conventions & gotchas

- **Imports:** use relative paths (`../../db/schema`). The `@/*` tsconfig alias exists but is not wired for runtime resolution — don't use it.
- **DB access in app code** goes through `app.db` (decorated by `dbPlugin`). `src/lib/db.ts` is a standalone unused helper — ignore it.
- **Migrations are undecided scaffold:** `drizzle.config.ts`/npm scripts target `./drizzle`, but there's also a parallel `src/db/migrations/` folder and a hand-written `src/db/migrate.ts`. No canonical workflow is locked yet — ask before standardizing.
- **Schema:** Drizzle `casing: "snake_case"`; IDs are `uuid` defaulted via `uuidv7()`.
- **CORS** allows only `http://localhost:5173` (set in `src/app.ts`) — adjust the `origin` if the front-end runs elsewhere.
- **`.env`** holds local dev DB credentials (loaded via `--env-file`/`dotenv`); values are non-secret defaults (`postgres`/`postgres`).
- **Commits:** gitmoji + type prefix, e.g. `:sparkles: feat: ...`, `:bug: fix: ...`.
