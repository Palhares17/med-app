import type { GroupsRepository } from "./groups.repository";
import { nanoid } from "nanoid";

function nextSunday(): Date {
  const d = new Date();
  d.setDate(d.getDate() + (7 - d.getDay()));
  d.setHours(0, 0, 0, 0);
  return d;
}

export class GroupsService {
  constructor(private readonly repository: GroupsRepository) {}

  async create(userId: string, data: { name: string; description: string }) {
    const inviteCode = nanoid(12).toUpperCase();
    const weeklyReset = nextSunday();
    return this.repository.create({
      ...data,
      createdBy: userId,
      inviteCode,
      weeklyReset,
    });
  }

  async listByUser(userId: string) {
    const grps = await this.repository.findByUser(userId);
    return Promise.all(
      grps.map(async (g) => {
        const memberCount = await this.repository.getMemberCount(g.id);
        return { ...g, memberCount };
      })
    );
  }

  async getDetail(groupId: string, userId: string) {
    const group = await this.repository.findById(groupId);
    if (!group) throw new Error("Grupo não encontrado");

    const isMember = await this.repository.isMember(groupId, userId);
    if (!isMember) throw new Error("Sem permissão");

    // Check if week needs resetting
    const now = new Date();
    if (now > group.weeklyReset) {
      await this.repository.awardMedals(groupId, group.weeklyReset);
      const newReset = nextSunday();
      await this.repository.updateWeeklyReset(groupId, newReset);
      group.weeklyReset = newReset;
    }

    const members = await this.repository.getMembers(groupId);
    const weekStart = new Date(group.weeklyReset);
    weekStart.setDate(weekStart.getDate() - 7);
    const ranking = await this.repository.getWeeklyRanking(groupId, weekStart);
    const memberCount = members.length;

    return { ...group, members, memberCount, ranking };
  }

  async joinByCode(userId: string, inviteCode: string) {
    const group = await this.repository.findByInviteCode(inviteCode);
    if (!group) throw new Error("Código de convite inválido");
    await this.repository.addMember(group.id, userId);
    return group;
  }

  async removeMember(adminId: string, groupId: string, memberId: string) {
    const group = await this.repository.findById(groupId);
    if (!group) throw new Error("Grupo não encontrado");
    if (group.createdBy !== adminId) throw new Error("Sem permissão");
    if (memberId === adminId) throw new Error("Criador não pode ser removido");
    await this.repository.removeMember(groupId, memberId);
  }

  async deleteGroup(adminId: string, groupId: string) {
    const group = await this.repository.findById(groupId);
    if (!group) throw new Error("Grupo não encontrado");
    if (group.createdBy !== adminId) throw new Error("Sem permissão");
    await this.repository.deleteGroup(groupId);
  }

  async getRanking(groupId: string, userId: string) {
    const isMember = await this.repository.isMember(groupId, userId);
    if (!isMember) throw new Error("Sem permissão");
    const group = await this.repository.findById(groupId);
    if (!group) throw new Error("Grupo não encontrado");
    const weekStart = new Date(group.weeklyReset);
    weekStart.setDate(weekStart.getDate() - 7);
    return this.repository.getWeeklyRanking(groupId, weekStart);
  }

  async getUserMedals(userId: string) {
    return this.repository.getUserMedals(userId);
  }
}
