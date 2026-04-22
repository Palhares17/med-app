export interface CreateGroupFormData {
  name: string
  description: string
}

export interface GroupListItem {
  id: string
  name: string
  description: string
  memberCount: number
  userPosition: number
  createdAt: string
}
