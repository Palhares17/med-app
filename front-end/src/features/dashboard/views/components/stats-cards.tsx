"use client"

import { FileText, Layers, ListChecks, Target } from "lucide-react"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { AnimatedCounter } from "@/core/components/animations/animated-counter"
import type { StatCard } from "@/features/dashboard/types"

const stats: StatCard[] = [
  {
    id: "pdfs",
    label: "PDFs Enviados",
    value: 12,
    icon: FileText,
  },
  {
    id: "flashcards",
    label: "Flashcards Gerados",
    value: 156,
    icon: Layers,
  },
  {
    id: "questions",
    label: "Questoes Respondidas",
    value: 89,
    icon: ListChecks,
  },
  {
    id: "accuracy",
    label: "Taxa de Acerto",
    value: 74,
    suffix: "%",
    icon: Target,
  },
]

export const StatsCards = () => {
  return (
    <StaggerChildren
      stagger={0.12}
      y={30}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                duration={1.8}
                delay={0.3}
              />
            </div>
          </div>
        )
      })}
    </StaggerChildren>
  )
}
