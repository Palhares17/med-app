import { groups, groupMembers, users, userAnswers, medals } from "../../db/schema";
import { eq, and, gte, inArray } from "drizzle-orm";
import type { Database } from "../../plugins/db.plugin";

export class GroupsRepository {
  constructor(private readonly db: Database) {}

  async create(data: {
    name: string;
    description: string;
    createdBy: string;
    inviteCode: string;
    weeklyReset: Date;
  }) {
    const [group] = await this.db.insert(groups).values(data).returning();
    // Creator is also a member
    await this.db.insert(groupMembers).values({ groupId: group.id, userId: data.createdBy });
    return group;
  }

  async findById(id: string) {
    const [g] = await this.db.select().from(groups).where(eq(groups.id, id));
    return g ?? null;
  }

  async findByInviteCode(code: string) {
    const [g] = await this.db.select().from(groups).where(eq(groups.inviteCode, code));
    return g ?? null;
  }

  async findByUser(userId: string) {
    const memberships = await this.db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    if (memberships.length === 0) return [];
    const groupIds = memberships.map((m) => m.groupId);
    return this.db.select().from(groups).where(inArray(groups.id, groupIds));
  }

  async isMember(groupId: string, userId: string) {
    const [m] = await this.db
      .select()
      .from(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
    return !!m;
  }

  async addMember(groupId: string, userId: string) {
    const exists = await this.isMember(groupId, userId);
    if (!exists) {
      await this.db.insert(groupMembers).values({ groupId, userId });
    }
  }

  async removeMember(groupId: string, userId: string) {
    await this.db
      .delete(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
  }

  async deleteGroup(groupId: string) {
    await this.db.delete(groups).where(eq(groups.id, groupId));
  }

  async getMembers(groupId: string) {
    return this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId));
  }

  async getWeeklyRanking(groupId: string, weekStart: Date) {
    const members = await this.getMembers(groupId);
    const ranking = await Promise.all(
      members.map(async (member) => {
        const answers = await this.db
          .select()
          .from(userAnswers)
          .where(
            and(
              eq(userAnswers.userId, member.id),
              eq(userAnswers.groupId, groupId),
              gte(userAnswers.answeredAt, weekStart)
            )
          );
        const weeklyScore = answers.reduce((s, a) => s + a.pointsEarned, 0);
        const weeklyAnswered = answers.length;
        return { ...member, weeklyScore, weeklyAnswered };
      })
    );

    return ranking
      .sort((a, b) =>
        b.weeklyScore !== a.weeklyScore
          ? b.weeklyScore - a.weeklyScore
          : b.weeklyAnswered - a.weeklyAnswered
      )
      .map((m, i) => ({ ...m, position: i + 1 }));
  }

  async getMemberCount(groupId: string) {
    const members = await this.db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
    return members.length;
  }

  async awardMedals(groupId: string, weekStart: Date) {
    const ranking = await this.getWeeklyRanking(groupId, weekStart);
    const medalTypes = ["gold", "silver", "bronze"] as const;
    for (const [i, type] of medalTypes.entries()) {
      if (ranking[i]) {
        await this.db.insert(medals).values({
          userId: ranking[i].id,
          groupId,
          type,
          weekStart,
        });
      }
    }
  }

  async getUserMedals(userId: string) {
    return this.db
      .select()
      .from(medals)
      .where(eq(medals.userId, userId));
  }

  async updateWeeklyReset(groupId: string, newReset: Date) {
    await this.db
      .update(groups)
      .set({ weeklyReset: newReset })
      .where(eq(groups.id, groupId));
  }
}
