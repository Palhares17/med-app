"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import gsap from "gsap"
import {
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ArrowLeft,
} from "lucide-react"

import { MOCK_DECKS } from "@/core/mocks/flashcards.mock"
import type { FlashcardDeck } from "@/core/entities/flashcard.entity"
import type { StudyResult } from "@/features/flashcards/types"
import { Button } from "@/core/components/ui/button"
import { FadeIn } from "@/core/components/animations/fade-in"
import { AnimatedCounter } from "@/core/components/animations/animated-counter"
import { FlipCard } from "./components/flip-card"
import { StudyProgress } from "./components/study-progress"

interface FlashcardStudyPageProps {
  deckId: string
}

function StudySkeleton() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-2 w-full rounded bg-muted" />
        <div className="flex gap-4">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="mx-auto h-72 w-full max-w-lg rounded-2xl border border-border bg-card sm:h-80" />
      <div className="flex justify-center gap-3">
        <div className="h-9 w-24 rounded-md bg-muted" />
        <div className="h-9 w-24 rounded-md bg-muted" />
      </div>
    </div>
  )
}

function ResultScreen({
  result,
  onRestart,
}: {
  result: StudyResult
  onRestart: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
    >
      <h2 className="text-2xl font-bold text-foreground">
        Sessao concluida!
      </h2>

      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl font-bold text-primary">
          <AnimatedCounter value={result.known} /> de{" "}
          <AnimatedCounter value={result.total} />
        </div>
        <p className="text-sm text-muted-foreground">cards que voce sabia</p>
      </div>

      <div className="text-3xl font-bold">
        <AnimatedCounter
          value={result.percentage}
          suffix="%"
          className={
            result.percentage >= 70
              ? "text-emerald-500"
              : result.percentage >= 50
                ? "text-yellow-500"
                : "text-red-500"
          }
        />
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3">
          <ThumbsUp className="size-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            Sei: {result.known}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-3">
          <ThumbsDown className="size-4 text-red-500" />
          <span className="text-sm font-medium text-red-500">
            Nao sei: {result.unknown}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
        <Button onClick={onRestart} variant="outline" className="flex-1">
          <RotateCcw className="size-4" />
          Refazer
        </Button>
        <Button asChild className="flex-1">
          <Link href="/flashcards">
            <ArrowLeft className="size-4" />
            Voltar aos decks
          </Link>
        </Button>
      </div>
    </div>
  )
}

export const FlashcardStudyPage = ({ deckId }: FlashcardStudyPageProps) => {
  const [deck, setDeck] = useState<FlashcardDeck | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [unknown, setUnknown] = useState(0)
  const [answered, setAnswered] = useState<Set<number>>(new Set())
  const [showResult, setShowResult] = useState(false)

  const cardWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = MOCK_DECKS.find((d) => d.id === deckId) ?? null
      setDeck(found)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [deckId])

  const animateCardTransition = useCallback(
    (direction: "left" | "right", callback: () => void) => {
      if (!cardWrapperRef.current) {
        callback()
        return
      }

      const xOut = direction === "left" ? -120 : 120
      const xIn = direction === "left" ? 120 : -120

      gsap.to(cardWrapperRef.current, {
        x: xOut,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          callback()
          gsap.fromTo(
            cardWrapperRef.current,
            { x: xIn, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" }
          )
        },
      })
    },
    []
  )

  const handlePrevious = () => {
    if (currentIndex <= 0) return
    animateCardTransition("right", () => {
      setCurrentIndex((prev) => prev - 1)
      setIsFlipped(false)
    })
  }

  const handleNext = () => {
    if (!deck || currentIndex >= deck.cards.length - 1) return
    animateCardTransition("left", () => {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
    })
  }

  const handleKnown = () => {
    if (!deck) return
    if (!answered.has(currentIndex)) {
      setKnown((prev) => prev + 1)
      setAnswered((prev) => new Set(prev).add(currentIndex))
    }

    if (currentIndex === deck.cards.length - 1) {
      // last card -> show result after a brief delay
      setTimeout(() => setShowResult(true), 300)
    } else {
      animateCardTransition("left", () => {
        setCurrentIndex((prev) => prev + 1)
        setIsFlipped(false)
      })
    }
  }

  const handleUnknown = () => {
    if (!deck) return
    if (!answered.has(currentIndex)) {
      setUnknown((prev) => prev + 1)
      setAnswered((prev) => new Set(prev).add(currentIndex))
    }

    if (currentIndex === deck.cards.length - 1) {
      setTimeout(() => setShowResult(true), 300)
    } else {
      animateCardTransition("left", () => {
        setCurrentIndex((prev) => prev + 1)
        setIsFlipped(false)
      })
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnown(0)
    setUnknown(0)
    setAnswered(new Set())
    setShowResult(false)
  }

  if (isLoading) {
    return <StudySkeleton />
  }

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-muted-foreground">Deck nao encontrado</p>
        <Button asChild variant="outline">
          <Link href="/flashcards">
            <ArrowLeft className="size-4" />
            Voltar aos decks
          </Link>
        </Button>
      </div>
    )
  }

  if (showResult) {
    const totalAnswered = known + unknown
    const percentage =
      totalAnswered > 0 ? Math.round((known / totalAnswered) * 100) : 0

    return (
      <div className="px-4 py-8">
        <FadeIn>
          <ResultScreen
            result={{
              total: deck.cards.length,
              known,
              unknown,
              percentage,
            }}
            onRestart={handleRestart}
          />
        </FadeIn>
      </div>
    )
  }

  const currentCard = deck.cards[currentIndex]

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/flashcards">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-foreground truncate">
            {deck.topic}
          </h1>
        </div>
      </FadeIn>

      <StudyProgress
        current={currentIndex + 1}
        total={deck.cards.length}
        known={known}
        unknown={unknown}
      />

      <div ref={cardWrapperRef}>
        <FlipCard
          key={currentIndex}
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((prev) => !prev)}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === deck.cards.length - 1}
        >
          Proximo
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Know / Don't know buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleKnown}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={answered.has(currentIndex)}
        >
          <ThumbsUp className="size-4" />
          Sei
        </Button>
        <Button
          onClick={handleUnknown}
          variant="destructive"
          disabled={answered.has(currentIndex)}
        >
          <ThumbsDown className="size-4" />
          Nao sei
        </Button>
      </div>
    </div>
  )
}
