import { pdfs } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import type { Database } from "../../plugins/db.plugin";

export class PdfsRepository {
  constructor(private readonly db: Database) {}

  async create(input: {
    userId: string;
    groupId?: string | null;
    filename: string;
    originalName: string;
    sizeBytes: number;
  }) {
    const [pdf] = await this.db.insert(pdfs).values(input).returning();
    return pdf;
  }

  async findByUser(userId: string) {
    return this.db.select().from(pdfs).where(eq(pdfs.userId, userId));
  }

  async findById(id: string) {
    const [pdf] = await this.db.select().from(pdfs).where(eq(pdfs.id, id));
    return pdf ?? null;
  }

  async delete(id: string, userId: string) {
    await this.db
      .delete(pdfs)
      .where(and(eq(pdfs.id, id), eq(pdfs.userId, userId)));
  }
}
