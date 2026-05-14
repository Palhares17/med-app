import { users } from "../../db/schema";
import type { Database } from "../../plugins/db.plugin";
import type { CreateUserInput } from "./users.schema";

export class UsersRepository {
  constructor(private readonly db: Database) {}

  async create(input: CreateUserInput) {
    const result = await this.db.insert(users).values(input).returning();
    return result[0];
  }

  async findAll() {
    return this.db.select().from(users);
  }
}
