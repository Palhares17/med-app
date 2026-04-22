"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { CheckCircle, XCircle } from "lucide-react"

interface AnswerFeedbackProps {
  isCorrect: boolean
  explanation: string
}

export const AnswerFeedback = ({
  isCorrect,
  explanation,
}: AnswerFeedbackProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { height: 0, opacity: 0, y: -10 },
      {
        height: "auto",
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    )
  }, [])

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        className={`rounded-xl border p-4 ${
          isCorrect
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isCorrect ? (
            <>
              <CheckCircle className="size-5 text-emerald-500" />
              <span className="font-semibold text-emerald-500">Correto!</span>
            </>
          ) : (
            <>
              <XCircle className="size-5 text-red-500" />
              <span className="font-semibold text-red-500">Incorreto!</span>
            </>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {explanation}
        </p>
      </div>
    </div>
  )
}
