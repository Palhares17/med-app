import { userAnswers, questions } from "../../db/schema";
import { eq, and, gte } from "drizzle-orm";
import type { Database } from "../../plugins/db.plugin";

export class ScoringRepository {
  constructor(private readonly db: Database) {}

  async recordAnswer(data: {
    userId: string;
    questionId: string;
    groupId?: string | null;
    selectedAlternativeId: string;
    isCorrect: boolean;
    pointsEarned: number;
  }) {
    const [answer] = await this.db.insert(userAnswers).values(data).returning();
    return answer;
  }

  async getWeeklyScoreForUser(userId: string, groupId: string, weekStart: Date) {
    const rows = await this.db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.userId, userId),
          eq(userAnswers.groupId, groupId),
          gte(userAnswers.answeredAt, weekStart)
        )
      );
    return {
      score: rows.reduce((sum, r) => sum + r.pointsEarned, 0),
      answered: rows.length,
    };
  }

  async getUserHistory(userId: string) {
    return this.db
      .select()
      .from(userAnswers)
      .where(eq(userAnswers.userId, userId));
  }
}
