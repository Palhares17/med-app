import { eq } from "drizzle-orm";
import { uploads } from "../../db/schema";
import type { Database } from "../../plugins/db.plugin";

export type UploadRow = typeof uploads.$inferSelect;
export type NewUpload = typeof uploads.$inferInsert;

export class UploadsRepository {
  constructor(private readonly db: Database) {}

  async create(data: NewUpload): Promise<UploadRow> {
    const result = await this.db.insert(uploads).values(data).returning();
    return result[0];
  }

  async findAll(userId: string): Promise<UploadRow[]> {
    return this.db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId));
  }

  async findById(id: string): Promise<UploadRow | undefined> {
    const result = await this.db
      .select()
      .from(uploads)
      .where(eq(uploads.id, id));
    return result[0];
  }

  async updateStatus(
    id: string,
    status: UploadRow["status"],
  ): Promise<UploadRow | undefined> {
    const result = await this.db
      .update(uploads)
      .set({ status })
      .where(eq(uploads.id, id))
      .returning();
    return result[0];
  }
}
