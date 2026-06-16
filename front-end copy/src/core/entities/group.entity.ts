export interface GroupMember {
  id: string
  name: string
  avatar: string
  weeklyScore: number
  weeklyAnswered: number
  position: number
}

export interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
  createdBy: string
  inviteCode: string
  members: GroupMember[]
  weeklyReset: string
}
