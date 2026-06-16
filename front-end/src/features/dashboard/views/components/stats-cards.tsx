"use client"

import { useState, useEffect } from "react"
import { FileText, Layers, ListChecks, Target } from "lucide-react"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { AnimatedCounter } from "@/core/components/animations/animated-counter"
import { apiGet } from "@/core/lib/api"

interface Stats {
  pdfs: number
  flashcardDecks: number
  questionsAnswered: number
  accuracyPercent: number
}

export const StatsCards = () => {
  const [stats, setStats] = useState<Stats>({ pdfs: 0, flashcardDecks: 0, questionsAnswered: 0, accuracyPercent: 0 })

  useEffect(() => {
    // Fetch in parallel
    Promise.allSettled([
      apiGet<unknown[]>("/pdfs"),
      apiGet<unknown[]>("/content/flashcards"),
      apiGet<unknown[]>("/scoring/answers/history"),
    ]).then(([pdfsRes, decksRes, answersRes]) => {
      const pdfs = pdfsRes.status === "fulfilled" ? (pdfsRes.value as unknown[]).length : 0
      const flashcardDecks = decksRes.status === "fulfilled" ? (decksRes.value as unknown[]).length : 0
      const answers = answersRes.status === "fulfilled" ? (answersRes.value as Array<{ isCorrect: boolean }>) : []
      const questionsAnswered = answers.length
      const correct = answers.filter((a) => a.isCorrect).length
      const accuracyPercent = questionsAnswered > 0 ? Math.round((correct / questionsAnswered) * 100) : 0
      setStats({ pdfs, flashcardDecks, questionsAnswered, accuracyPercent })
    })
  }, [])

  const cards = [
    { id: "pdfs", label: "PDFs Enviados", value: stats.pdfs, icon: FileText },
    { id: "flashcards", label: "Decks de Flashcards", value: stats.flashcardDecks, icon: Layers },
    { id: "questions", label: "Questoes Respondidas", value: stats.questionsAnswered, icon: ListChecks },
    { id: "accuracy", label: "Taxa de Acerto", value: stats.accuracyPercent, suffix: "%", icon: Target },
  ]

  return (
    <StaggerChildren stagger={0.12} y={30} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.8} delay={0.3} />
            </div>
          </div>
        )
      })}
    </StaggerChildren>
  )
}
