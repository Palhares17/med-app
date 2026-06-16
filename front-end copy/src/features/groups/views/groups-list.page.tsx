"use client"

import { useState, useEffect, useCallback } from "react"
import { Users } from "lucide-react"
import { MOCK_GROUPS } from "@/core/mocks/groups.mock"
import type { Group } from "@/core/entities/group.entity"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { EmptyState } from "@/core/components/shared/empty-state"
import { GroupCard } from "./components/group-card"
import { CreateGroupDialog } from "./components/create-group-dialog"

function GroupCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
        </div>
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-3 w-28 rounded bg-muted" />
      </div>
    </div>
  )
}

export const GroupsListPage = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setGroups(MOCK_GROUPS)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleGroupCreated = useCallback((newGroup: Group) => {
    setGroups((prev) => [newGroup, ...prev])
  }, [])

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <FadeIn>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Meus Grupos
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Participe de grupos de estudo e dispute o ranking semanal
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <CreateGroupDialog onGroupCreated={handleGroupCreated} />
            </div>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <GroupCardSkeleton key={i} />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum grupo encontrado"
            description="Você ainda não participa de nenhum grupo. Crie um grupo e convide seus colegas!"
          />
        ) : (
          <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </StaggerChildren>
        )}
      </div>
    </PageContainer>
  )
}
