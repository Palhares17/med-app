import fp from "fastify-plugin";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export type Database = ReturnType<typeof drizzle>;

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
  }
}

export const dbPlugin = fp(
  async (app) => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    // casing: "snake_case" alinha as chaves camelCase do schema (ex.: fileName)
    // com as colunas snake_case geradas pelo drizzle-kit (drizzle.config.ts).
    const db = drizzle(pool, { casing: "snake_case" });

    app.decorate("db", db);

    app.addHook("onClose", async () => {
      await pool.end();
    });
  },
  { name: "db-plugin" },
);
