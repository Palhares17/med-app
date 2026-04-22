"use client"

import { useState, useEffect } from "react"
import { ListChecks } from "lucide-react"

import { MOCK_QUESTION_SETS } from "@/core/mocks/questions.mock"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { EmptyState } from "@/core/components/shared/empty-state"
import { QuizCard } from "./components/quiz-card"

function QuizCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
    </div>
  )
}

export const QuestionsListPage = () => {
  const [questionSets, setQuestionSets] = useState(MOCK_QUESTION_SETS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestionSets(MOCK_QUESTION_SETS)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <FadeIn>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Minhas Questoes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Teste seus conhecimentos com quizzes baseados no conteudo estudado
          </p>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <QuizCardSkeleton key={i} />
            ))}
          </div>
        ) : questionSets.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nenhuma questao encontrada"
            description="Voce ainda nao tem nenhum conjunto de questoes. Envie um PDF para gerar questoes automaticamente."
            action={{
              label: "Enviar PDF",
              href: "/upload",
            }}
          />
        ) : (
          <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {questionSets.map((qs) => (
              <QuizCard key={qs.id} questionSet={qs} />
            ))}
          </StaggerChildren>
        )}
      </div>
    </PageContainer>
  )
}
