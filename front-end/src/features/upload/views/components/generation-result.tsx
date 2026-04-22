"use client"

import { useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import { Button } from "@/core/components/ui/button"
import { ROUTES } from "@/core/constants"
import type { GenerationType } from "@/features/upload/types"

interface GenerationResultProps {
  type: GenerationType
  count: number
  topic: string
  deckId: string
  onReset: () => void
}

export const GenerationResult = ({
  type,
  count,
  topic,
  deckId,
  onReset,
}: GenerationResultProps) => {
  const checkRef = useRef<HTMLDivElement>(null)

  const typeLabel = type === "flashcards" ? "flashcards" : "questoes"
  const creditsUsed = type === "flashcards" ? 8 : 10
  const studyHref =
    type === "flashcards"
      ? ROUTES.FLASHCARD_STUDY(deckId)
      : ROUTES.QUESTION_QUIZ(deckId)

  useGSAP(() => {
    if (!checkRef.current) return

    gsap.fromTo(
      checkRef.current,
      { scale: 0, rotate: -90 },
      {
        scale: 1,
        rotate: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      }
    )
  }, { scope: checkRef })

  return (
    <div className="flex flex-col items-center py-8">
      <StaggerChildren stagger={0.15} y={20} className="flex flex-col items-center gap-6">
        {/* Success icon */}
        <div ref={checkRef}>
          <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="size-10 text-green-500" />
          </div>
        </div>

        {/* Success message */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {count} {typeLabel} gerados com sucesso!
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Topico: {topic}
          </p>
        </div>

        {/* Credits info */}
        <div className="rounded-lg bg-muted px-4 py-2">
          <p className="text-sm text-muted-foreground">
            {creditsUsed} creditos consumidos nesta geracao
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href={studyHref}>
              Ir estudar
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="size-4" />
            Gerar mais
          </Button>
        </div>
      </StaggerChildren>
    </div>
  )
}
