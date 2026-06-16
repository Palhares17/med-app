"use client"

import { useState, useEffect } from "react"
import { Layers, ListChecks, Upload } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { apiGet } from "@/core/lib/api"

interface ActivityItem {
  id: string
  type: "flashcard" | "quiz" | "upload"
  description: string
  date: Date
}

const activityIcons = { flashcard: Layers, quiz: ListChecks, upload: Upload } as const
const activityColors = {
  flashcard: "bg-blue-500/10 text-blue-500",
  quiz: "bg-green-500/10 text-green-500",
  upload: "bg-purple-500/10 text-purple-500",
} as const

export const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    Promise.allSettled([
      apiGet<Array<{ id: string; originalName: string; uploadedAt: string }>>("/pdfs"),
      apiGet<Array<{ id: string; createdAt: string; topic: { topic: string } }>>("/content/flashcards"),
      apiGet<Array<{ id: string; createdAt: string; topic: { topic: string } }>>("/content/questions"),
    ]).then(([pdfsRes, decksRes, setsRes]) => {
      const items: ActivityItem[] = []

      if (pdfsRes.status === "fulfilled") {
        pdfsRes.value.forEach((p) => {
          items.push({ id: `pdf-${p.id}`, type: "upload", description: `PDF '${p.originalName}' enviado`, date: new Date(p.uploadedAt) })
        })
      }
      if (decksRes.status === "fulfilled") {
        decksRes.value.forEach((d) => {
          items.push({ id: `deck-${d.id}`, type: "flashcard", description: `Deck '${d.topic?.topic ?? "Flashcards"}' criado`, date: new Date(d.createdAt) })
        })
      }
      if (setsRes.status === "fulfilled") {
        setsRes.value.forEach((s) => {
          items.push({ id: `set-${s.id}`, type: "quiz", description: `Questoes '${s.topic?.topic ?? "Questoes"}' geradas`, date: new Date(s.createdAt) })
        })
      }

      items.sort((a, b) => b.date.getTime() - a.date.getTime())
      setActivities(items.slice(0, 8))
    })
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
      </div>
      {activities.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-muted-foreground">
          Nenhuma atividade ainda. Envie um PDF para começar!
        </div>
      ) : (
        <StaggerChildren stagger={0.08} delay={0.2} className="divide-y divide-border">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            const colorClass = activityColors[activity.type]
            return (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.date, { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            )
          })}
        </StaggerChildren>
      )}
    </div>
  )
}
