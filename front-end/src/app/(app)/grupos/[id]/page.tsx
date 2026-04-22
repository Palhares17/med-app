"use client"

import { use } from "react"
import { GroupDetailPage } from "@/features/groups/views/group-detail.page"

export default function GroupDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <GroupDetailPage groupId={id} />
}
