"use client"

import { StaggerChildren } from "@/core/components/animations/stagger-children"
import type { GroupMember } from "@/core/entities/group.entity"
import { RankingUserRow } from "./ranking-user-row"

interface RankingTableProps {
  members: GroupMember[]
}

export const RankingTable = ({ members }: RankingTableProps) => {
  const sorted = [...members].sort((a, b) => a.position - b.position)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">
          Ranking Completo
        </h3>
      </div>

      <div className="px-4 py-2">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="w-8 text-center">#</span>
          <span className="size-9" />
          <span className="flex-1">Membro</span>
          <span className="hidden sm:block">Atividade</span>
          <span className="min-w-[60px] text-right">Pontos</span>
        </div>

        <StaggerChildren stagger={0.06} delay={0.3} className="flex flex-col gap-1">
          {sorted.map((member) => (
            <RankingUserRow
              key={member.id}
              member={member}
              animateHighlight
            />
          ))}
        </StaggerChildren>
      </div>
    </div>
  )
}
