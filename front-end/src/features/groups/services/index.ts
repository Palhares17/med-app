import { apiGet, apiPost, apiDelete } from "@/core/lib/api"
import type { Group } from "@/core/entities/group.entity"

export interface ApiGroup {
  id: string
  name: string
  description: string
  createdBy: string
  inviteCode: string
  weeklyReset: string
  memberCount: number
  members?: Array<{
    id: string
    name: string
    avatar: string | null
    weeklyScore: number
    weeklyAnswered: number
    position: number
  }>
  ranking?: Array<{
    id: string
    name: string
    avatar: string | null
    weeklyScore: number
    weeklyAnswered: number
    position: number
  }>
}

function toGroup(g: ApiGroup): Group {
  return {
    id: g.id,
    name: g.name,
    description: g.description,
    memberCount: g.memberCount ?? g.members?.length ?? 0,
    createdAt: g.weeklyReset, // approximate
    createdBy: g.createdBy,
    inviteCode: g.inviteCode,
    weeklyReset: g.weeklyReset,
    members: (g.ranking ?? g.members ?? []).map((m, i) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(m.name)}`,
      weeklyScore: m.weeklyScore ?? 0,
      weeklyAnswered: m.weeklyAnswered ?? 0,
      position: m.position ?? i + 1,
    })),
  }
}

export async function listGroups(): Promise<Group[]> {
  const data = await apiGet<ApiGroup[]>("/groups")
  return data.map(toGroup)
}

export async function getGroupDetail(id: string): Promise<Group> {
  const data = await apiGet<ApiGroup>(`/groups/${id}`)
  return toGroup(data)
}

export async function createGroup(payload: { name: string; description: string }): Promise<Group> {
  const data = await apiPost<ApiGroup>("/groups", payload)
  return toGroup({ ...data, memberCount: 1 })
}

export async function joinGroupByCode(code: string): Promise<Group> {
  const data = await apiPost<ApiGroup>(`/groups/join/${code}`)
  return toGroup({ ...data, memberCount: 0 })
}

export async function removeMember(groupId: string, memberId: string): Promise<void> {
  return apiDelete(`/groups/${groupId}/members/${memberId}`)
}

export async function deleteGroup(groupId: string): Promise<void> {
  return apiDelete(`/groups/${groupId}`)
}
