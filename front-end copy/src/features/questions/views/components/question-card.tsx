"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { Check, X } from "lucide-react"

import type { Question } from "@/core/entities/question.entity"
import { cn } from "@/core/lib/utils"

interface QuestionCardProps {
  question: Question
  onAnswer: (alternativeId: string) => void
  selectedAnswer: string | null
  showFeedback: boolean
}

export const QuestionCard = ({
  question,
  onAnswer,
  selectedAnswer,
  showFeedback,
}: QuestionCardProps) => {
  const alternativesRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!showFeedback || !selectedAnswer) return

    const correctAlt = question.alternatives.find((a) => a.isCorrect)
    const isCorrectAnswer = correctAlt?.id === selectedAnswer

    // Find the correct alternative element
    const correctIndex = question.alternatives.findIndex((a) => a.isCorrect)
    const correctEl = alternativesRef.current[correctIndex]

    if (correctEl) {
      // Pulse animation for correct answer
      gsap.fromTo(
        correctEl,
        { scale: 1 },
        {
          scale: 1.03,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        }
      )
    }

    // Shake animation for wrong selected answer
    if (!isCorrectAnswer) {
      const selectedIndex = question.alternatives.findIndex(
        (a) => a.id === selectedAnswer
      )
      const wrongEl = alternativesRef.current[selectedIndex]

      if (wrongEl) {
        gsap.to(wrongEl, {
          x: -8,
          duration: 0.08,
          yoyo: true,
          repeat: 5,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(wrongEl, { x: 0 })
          },
        })
      }
    }
  }, [showFeedback, selectedAnswer, question.alternatives])

  const getAlternativeStyles = (altId: string, isCorrect: boolean) => {
    if (!showFeedback) {
      return cn(
        "w-full rounded-lg border border-border bg-card p-4 text-left transition-colors",
        selectedAnswer === altId
          ? "border-primary bg-primary/5"
          : "hover:border-primary/30 hover:bg-accent"
      )
    }

    // Feedback mode
    if (isCorrect) {
      return "w-full rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-4 text-left"
    }

    if (altId === selectedAnswer && !isCorrect) {
      return "w-full rounded-lg border-2 border-red-500 bg-red-500/10 p-4 text-left"
    }

    return "w-full rounded-lg border border-border bg-card/50 p-4 text-left opacity-50"
  }

  const getLetterLabel = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, D
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-foreground leading-relaxed sm:text-xl">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {question.alternatives.map((alt, index) => (
          <button
            key={alt.id}
            ref={(el) => {
              alternativesRef.current[index] = el
            }}
            onClick={() => {
              if (!showFeedback) {
                onAnswer(alt.id)
              }
            }}
            disabled={showFeedback}
            className={getAlternativeStyles(alt.id, alt.isCorrect)}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  showFeedback && alt.isCorrect
                    ? "bg-emerald-500 text-white"
                    : showFeedback && alt.id === selectedAnswer && !alt.isCorrect
                      ? "bg-red-500 text-white"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {showFeedback && alt.isCorrect ? (
                  <Check className="size-4" />
                ) : showFeedback &&
                  alt.id === selectedAnswer &&
                  !alt.isCorrect ? (
                  <X className="size-4" />
                ) : (
                  getLetterLabel(index)
                )}
              </span>
              <span
                className={cn(
                  "text-sm leading-relaxed",
                  showFeedback && !alt.isCorrect && alt.id !== selectedAnswer
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {alt.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
