"use client"

import { Layers, ListChecks, Upload } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import type { RecentActivity as RecentActivityType } from "@/features/dashboard/types"

const activities: RecentActivityType[] = [
  {
    id: "1",
    type: "flashcard",
    description: "Deck 'Sistema Cardiovascular' criado",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "quiz",
    description: "Quiz 'Farmacologia Basica' completado - 7/8 acertos",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "upload",
    description: "PDF 'Neuroanatomia Funcional' enviado",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "flashcard",
    description: "Deck 'Bioquimica - Enzimas' estudado",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "quiz",
    description: "Quiz 'Anatomia do Torax' completado - 6/8 acertos",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    type: "upload",
    description: "PDF 'Fisiologia Renal' enviado",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

const activityIcons = {
  flashcard: Layers,
  quiz: ListChecks,
  upload: Upload,
} as const

const activityColors = {
  flashcard: "bg-blue-500/10 text-blue-500",
  quiz: "bg-green-500/10 text-green-500",
  upload: "bg-purple-500/10 text-purple-500",
} as const

export const RecentActivity = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
      </div>
      <StaggerChildren stagger={0.08} delay={0.2} className="divide-y divide-border">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type]
          const colorClass = activityColors[activity.type]

          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.date, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </StaggerChildren>
    </div>
  )
}
