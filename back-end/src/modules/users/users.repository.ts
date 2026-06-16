import { users, medals } from "../../db/schema";
import { eq } from "drizzle-orm";
import type { Database } from "../../plugins/db.plugin";
import type { CreateUserInput } from "./users.schema";

export class UsersRepository {
  constructor(private readonly db: Database) {}

  async upsert(input: { id: string; name: string; email: string; avatar?: string | null }) {
    const [user] = await this.db
      .insert(users)
      .values(input)
      .onConflictDoUpdate({
        target: users.email,
        set: { name: input.name, avatar: input.avatar },
      })
      .returning();
    return user;
  }

  async create(input: CreateUserInput) {
    const [user] = await this.db.insert(users).values(input).returning();
    return user;
  }

  async findAll() {
    return this.db.select().from(users);
  }

  async findById(id: string) {
    const [u] = await this.db.select().from(users).where(eq(users.id, id));
    return u ?? null;
  }

  async findByEmail(email: string) {
    const [u] = await this.db.select().from(users).where(eq(users.email, email));
    return u ?? null;
  }

  async getMedals(userId: string) {
    return this.db.select().from(medals).where(eq(medals.userId, userId));
  }
}
