"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ArrowLeft, ChevronRight } from "lucide-react"

import { MOCK_QUESTION_SETS } from "@/core/mocks/questions.mock"
import type { QuestionSet } from "@/core/entities/question.entity"
import type { QuizResult as QuizResultType } from "@/features/questions/types"
import { Button } from "@/core/components/ui/button"
import { Progress } from "@/core/components/ui/progress"
import { FadeIn } from "@/core/components/animations/fade-in"
import { QuestionCard } from "./components/question-card"
import { AnswerFeedback } from "./components/answer-feedback"
import { QuizResult } from "./components/quiz-result"

interface QuestionQuizPageProps {
  setId: string
}

function QuizSkeleton() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-2 w-full rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-8 w-full rounded bg-muted" />
        <div className="h-8 w-5/6 rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 w-full rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}

export const QuestionQuizPage = ({ setId }: QuestionQuizPageProps) => {
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState<
    Array<{
      questionId: string
      selectedId: string
      correctId: string
      isCorrect: boolean
    }>
  >([])
  const [showResult, setShowResult] = useState(false)

  const questionWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const found =
        MOCK_QUESTION_SETS.find((qs) => qs.id === setId) ?? null
      setQuestionSet(found)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [setId])

  const animateTransition = useCallback((callback: () => void) => {
    if (!questionWrapperRef.current) {
      callback()
      return
    }

    gsap.to(questionWrapperRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        callback()
        gsap.fromTo(
          questionWrapperRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
        )
      },
    })
  }, [])

  const handleAnswer = (alternativeId: string) => {
    if (showFeedback || !questionSet) return

    setSelectedAnswer(alternativeId)
    setShowFeedback(true)

    const currentQuestion = questionSet.questions[currentIndex]
    const correctAlt = currentQuestion.alternatives.find((a) => a.isCorrect)
    const isCorrect = correctAlt?.id === alternativeId

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedId: alternativeId,
        correctId: correctAlt?.id ?? "",
        isCorrect,
      },
    ])
  }

  const handleNext = () => {
    if (!questionSet) return

    if (currentIndex === questionSet.questions.length - 1) {
      // Last question -- show results
      setShowResult(true)
      return
    }

    animateTransition(() => {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    })
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setAnswers([])
    setShowResult(false)
  }

  if (isLoading) {
    return <QuizSkeleton />
  }

  if (!questionSet) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-muted-foreground">
          Conjunto de questoes nao encontrado
        </p>
        <Button asChild variant="outline">
          <Link href="/questoes">
            <ArrowLeft className="size-4" />
            Voltar as questoes
          </Link>
        </Button>
      </div>
    )
  }

  if (showResult) {
    const correct = answers.filter((a) => a.isCorrect).length
    const incorrect = answers.filter((a) => !a.isCorrect).length
    const percentage =
      answers.length > 0
        ? Math.round((correct / answers.length) * 100)
        : 0

    const result: QuizResultType = {
      total: questionSet.questions.length,
      correct,
      incorrect,
      percentage,
      answers,
    }

    return (
      <div className="px-4 py-8">
        <FadeIn>
          <QuizResult
            result={result}
            questions={questionSet.questions}
            onRestart={handleRestart}
          />
        </FadeIn>
      </div>
    )
  }

  const currentQuestion = questionSet.questions[currentIndex]
  const progressPercentage = Math.round(
    ((currentIndex + 1) / questionSet.questions.length) * 100
  )

  const isCorrectAnswer =
    showFeedback &&
    currentQuestion.alternatives.find((a) => a.isCorrect)?.id ===
      selectedAnswer

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/questoes">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-foreground truncate">
            {questionSet.topic}
          </h1>
        </div>
      </FadeIn>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Questao {currentIndex + 1} de {questionSet.questions.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {progressPercentage}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Question */}
      <div ref={questionWrapperRef}>
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
        />
      </div>

      {/* Feedback */}
      {showFeedback && (
        <AnswerFeedback
          isCorrect={isCorrectAnswer ?? false}
          explanation={currentQuestion.explanation}
        />
      )}

      {/* Next button */}
      {showFeedback && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>
            {currentIndex === questionSet.questions.length - 1
              ? "Ver resultado"
              : "Proxima"}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
