---
name: new-module
description: Scaffold a new Fastify domain module under src/modules/<name>/ following the users/ reference architecture (schema, repository, service, controller, plugin, router) and register it in src/app.ts. Trigger with /new-module <name>.
disable-model-invocation: true
---

# Scaffold a new domain module

Create a fully layered domain module matching `src/modules/users/`. The module name comes from `$ARGUMENTS` (e.g. `/new-module flashcards`).

## Steps

1. **Resolve names** from `$ARGUMENTS`:
   - `dir` = lowercase plural slug (e.g. `flashcards`) → folder `src/modules/<dir>/`.
   - `Pascal` = PascalCase singular base for class names (e.g. `Flashcard`) → `FlashcardsController`, `FlashcardsService`, `FlashcardsRepository`.
   - `decorator` = `<dir>` (the Fastify decoration key, e.g. `app.flashcards`).
   If the table doesn't exist yet, add it to `src/db/schema.ts` (snake_case casing, `uuid` PK defaulted via `uuidv7()`) — or ask the user which table this module maps to.

2. **Create the six files** under `src/modules/<dir>/`, mirroring `src/modules/users/` exactly:
   - `<dir>.schema.ts` — Zod request/response schemas + `z.infer` types.
   - `<dir>.repository.ts` — Drizzle data access; `constructor(private readonly db: Database)` importing `Database` from `../../plugins/db.plugin`.
   - `<dir>.service.ts` — business logic; `constructor(private readonly repository: <Pascal>sRepository)`.
   - `<dir>.controller.ts` — handlers as **arrow-function class properties**; `constructor(private readonly service: <Pascal>sService)`.
   - `<dir>.plugin.ts` — `fp()` plugin: build repository → service → controller, `app.decorate("<decorator>", {...})`, augment `FastifyInstance` via `declare module "fastify"`, set `dependencies: ["db-plugin"]`.
   - `<dir>.router.ts` — `FastifyPluginAsyncZod` with Zod `schema` (`tags`/`summary`/`body`/`response`) calling `app.<decorator>.controller.<handler>`.

   Read the corresponding `users` file first and adapt it — keep the same import style (relative paths, never the `@/*` alias), structure, and ordering.

3. **Register in `src/app.ts`**, following the existing order: add `await app.register(<dir>Plugin);` (plugin first, injects services) then `await app.register(<dir>Routes, { prefix: "/<dir>" });` after the `users` registrations. Add the two imports at the top.

4. **Verify** it compiles: `pnpm build` (or `pnpm dev` briefly). Fix any type errors before finishing.

5. Summarize the files created and the routes now available under `/<dir>` (visible in Swagger at `/docs`).

## Notes

- Controllers MUST use arrow-function properties so `this` survives being passed directly as a route handler.
- The plugin must declare `dependencies: ["db-plugin"]` so `app.db` is available when it runs.
- Don't invent endpoints — start with the same `create` + `findAll` shape as `users` unless the user specifies routes.
