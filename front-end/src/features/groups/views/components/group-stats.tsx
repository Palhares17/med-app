"use client"

import { Users, MessageSquare, Target, Trophy } from "lucide-react"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { AnimatedCounter } from "@/core/components/animations/animated-counter"
import type { Group } from "@/core/entities/group.entity"

interface GroupStatsProps {
  group: Group
}

export const GroupStats = ({ group }: GroupStatsProps) => {
  const totalAnswered = group.members.reduce(
    (sum, m) => sum + m.weeklyAnswered,
    0
  )
  const totalScore = group.members.reduce(
    (sum, m) => sum + m.weeklyScore,
    0
  )
  const avgAccuracy =
    totalAnswered > 0
      ? Math.round((totalScore / (totalAnswered * 10)) * 100)
      : 0
  const mostActive = [...group.members].sort(
    (a, b) => b.weeklyAnswered - a.weeklyAnswered
  )[0]

  const stats = [
    {
      id: "members",
      label: "Total de Membros",
      value: group.memberCount,
      icon: Users,
    },
    {
      id: "answered",
      label: "Respostas na Semana",
      value: totalAnswered,
      icon: MessageSquare,
    },
    {
      id: "accuracy",
      label: "Acerto Médio",
      value: avgAccuracy,
      suffix: "%",
      icon: Target,
    },
    {
      id: "active",
      label: "Mais Ativo",
      value: mostActive?.weeklyAnswered ?? 0,
      suffix: " resp.",
      icon: Trophy,
      extra: mostActive?.name,
    },
  ]

  return (
    <StaggerChildren
      stagger={0.1}
      y={20}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                duration={1.5}
                delay={0.4}
              />
            </div>
            {stat.extra && (
              <p className="truncate text-xs text-muted-foreground">
                {stat.extra}
              </p>
            )}
          </div>
        )
      })}
    </StaggerChildren>
  )
}
