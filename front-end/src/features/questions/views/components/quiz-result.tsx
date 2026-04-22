"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, Trophy } from "lucide-react"

import type { Question } from "@/core/entities/question.entity"
import type { QuizResult as QuizResultType } from "@/features/questions/types"
import { Button } from "@/core/components/ui/button"
import { AnimatedCounter } from "@/core/components/animations/animated-counter"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { cn } from "@/core/lib/utils"

interface QuizResultProps {
  result: QuizResultType
  questions: Question[]
  onRestart: () => void
}

export const QuizResult = ({
  result,
  questions,
  onRestart,
}: QuizResultProps) => {
  const trophyRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    )
  }, [])

  // Celebratory animation if score > 80%
  useEffect(() => {
    if (result.percentage <= 80 || !trophyRef.current) return

    gsap.fromTo(
      trophyRef.current,
      { scale: 0, rotation: -20 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "elastic.out(1, 0.5)",
      }
    )

    // Continuous subtle float animation
    gsap.to(trophyRef.current, {
      y: -6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    })
  }, [result.percentage])

  const getPercentageColor = () => {
    if (result.percentage >= 70) return "text-emerald-500"
    if (result.percentage >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-lg"
    >
      {result.percentage > 80 && (
        <div ref={trophyRef}>
          <Trophy className="size-14 text-yellow-500" />
        </div>
      )}

      <h2 className="text-2xl font-bold text-foreground">
        Resultado do Quiz
      </h2>

      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl font-bold text-primary">
          <AnimatedCounter value={result.correct} /> de{" "}
          <AnimatedCounter value={result.total} />
        </div>
        <p className="text-sm text-muted-foreground">respostas corretas</p>
      </div>

      <div className="text-4xl font-bold">
        <AnimatedCounter
          value={result.percentage}
          suffix="%"
          className={getPercentageColor()}
        />
      </div>

      <div className="flex w-full gap-3">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3">
          <CheckCircle className="size-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            Corretas: {result.correct}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-3">
          <XCircle className="size-4 text-red-500" />
          <span className="text-sm font-medium text-red-500">
            Incorretas: {result.incorrect}
          </span>
        </div>
      </div>

      {/* Question review list */}
      <div className="w-full">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Revisao das questoes
        </h3>
        <StaggerChildren className="flex flex-col gap-2">
          {result.answers.map((answer, index) => {
            const question = questions.find((q) => q.id === answer.questionId)
            return (
              <div
                key={answer.questionId}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  answer.isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                )}
              >
                <div className="mt-0.5">
                  {answer.isCorrect ? (
                    <CheckCircle className="size-4 text-emerald-500" />
                  ) : (
                    <XCircle className="size-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                  {index + 1}. {question?.question ?? "Questao"}
                </p>
              </div>
            )
          })}
        </StaggerChildren>
      </div>

      <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
        <Button onClick={onRestart} variant="outline" className="flex-1">
          <RotateCcw className="size-4" />
          Refazer Quiz
        </Button>
        <Button asChild className="flex-1">
          <Link href="/questoes">
            <ArrowLeft className="size-4" />
            Voltar as Questoes
          </Link>
        </Button>
      </div>
    </div>
  )
}
