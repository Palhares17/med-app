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
    const db = drizzle(pool);

    app.decorate("db", db);

    app.addHook("onClose", async () => {
      await pool.end();
    });
  },
  { name: "db-plugin" },
);
