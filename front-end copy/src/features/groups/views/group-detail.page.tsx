"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { MOCK_GROUPS } from "@/core/mocks/groups.mock"
import type { Group } from "@/core/entities/group.entity"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { Separator } from "@/core/components/ui/separator"
import { RankingPodium } from "./components/ranking-podium"
import { RankingTable } from "./components/ranking-table"
import { GroupStats } from "./components/group-stats"
import { GroupMembersList } from "./components/group-members-list"
import { InviteLinkDialog } from "./components/invite-link-dialog"
import { WeeklyTimer } from "./components/weekly-timer"

interface GroupDetailPageProps {
  groupId: string
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
        <div className="flex gap-3">
          <div className="h-6 w-24 rounded-full bg-muted" />
          <div className="h-6 w-32 rounded bg-muted" />
        </div>
      </div>
      <div className="h-64 rounded-xl bg-muted" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

export const GroupDetailPage = ({ groupId }: GroupDetailPageProps) => {
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = MOCK_GROUPS.find((g) => g.id === groupId) ?? null
      setGroup(found)
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [groupId])

  if (isLoading) {
    return (
      <PageContainer>
        <DetailSkeleton />
      </PageContainer>
    )
  }

  if (!group) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-lg text-muted-foreground">Grupo não encontrado</p>
          <Button asChild variant="outline">
            <Link href="/grupos">
              <ArrowLeft className="size-4" />
              Voltar aos grupos
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon">
                <Link href="/grupos">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {group.name}
              </h1>
            </div>

            <p className="text-muted-foreground pl-12">{group.description}</p>

            <div className="flex flex-wrap items-center gap-3 pl-12">
              <Badge variant="secondary" className="gap-1.5">
                <Users className="size-3.5" />
                {group.memberCount} membros
              </Badge>

              <WeeklyTimer resetDate={group.weeklyReset} />

              <InviteLinkDialog
                inviteCode={group.inviteCode}
                groupName={group.name}
              />
            </div>
          </div>
        </FadeIn>

        <Separator />

        {/* Podium */}
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-2 text-center text-lg font-semibold text-foreground">
              Top 3 da Semana
            </h3>
            <RankingPodium members={group.members} />
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.2}>
          <GroupStats group={group} />
        </FadeIn>

        {/* Ranking Table */}
        <FadeIn delay={0.3}>
          <RankingTable members={group.members} />
        </FadeIn>

        {/* Members */}
        <FadeIn delay={0.4}>
          <GroupMembersList
            members={group.members}
            createdBy={group.createdBy}
          />
        </FadeIn>
      </div>
    </PageContainer>
  )
}
