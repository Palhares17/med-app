"use client"

import { useState, useEffect } from "react"
import { Layers } from "lucide-react"

import { MOCK_DECKS } from "@/core/mocks/flashcards.mock"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { EmptyState } from "@/core/components/shared/empty-state"
import { DeckCard } from "./components/deck-card"

function DeckCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
    </div>
  )
}

export const FlashcardsListPage = () => {
  const [decks, setDecks] = useState(MOCK_DECKS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDecks(MOCK_DECKS)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <FadeIn>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Meus Flashcards
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Revise seus decks de flashcards para fixar o conteudo
          </p>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <DeckCardSkeleton key={i} />
            ))}
          </div>
        ) : decks.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Nenhum deck encontrado"
            description="Voce ainda nao criou nenhum deck de flashcards. Envie um PDF para gerar flashcards automaticamente."
            action={{
              label: "Enviar PDF",
              href: "/upload",
            }}
          />
        ) : (
          <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </StaggerChildren>
        )}
      </div>
    </PageContainer>
  )
}
