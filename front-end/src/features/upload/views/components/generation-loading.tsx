"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Brain } from "lucide-react"
import type { GenerationType } from "@/features/upload/types"

interface GenerationLoadingProps {
  type: GenerationType
}

const messages: Record<GenerationType, string[]> = {
  flashcards: [
    "Analisando conteudo...",
    "Extraindo conceitos-chave...",
    "Gerando flashcards...",
    "Quase la...",
  ],
  questions: [
    "Analisando conteudo...",
    "Extraindo conceitos-chave...",
    "Gerando questoes...",
    "Quase la...",
  ],
}

export const GenerationLoading = ({ type }: GenerationLoadingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const brainRef = useRef<HTMLDivElement>(null)
  const [messageIndex, setMessageIndex] = useState(0)
  const [skeletonCount, setSkeletonCount] = useState(0)

  const typeMessages = messages[type]

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < typeMessages.length - 1) return prev + 1
        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [typeMessages.length])

  // Show skeleton cards one by one
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    for (let i = 0; i < 4; i++) {
      timeouts.push(
        setTimeout(() => {
          setSkeletonCount(i + 1)
        }, 1200 + i * 600)
      )
    }
    return () => timeouts.forEach(clearTimeout)
  }, [])

  useGSAP(() => {
    if (!containerRef.current) return

    // Progress bar animation
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        { width: "100%", duration: 4, ease: "power1.inOut" }
      )
    }

    // Pulsing brain
    if (brainRef.current) {
      gsap.to(brainRef.current, {
        scale: 1.15,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
      gsap.to(brainRef.current, {
        rotate: 5,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
  }, { scope: containerRef })

  // Animate new skeleton cards
  useEffect(() => {
    if (containerRef.current && skeletonCount > 0) {
      const cards = containerRef.current.querySelectorAll("[data-skeleton-card]")
      const lastCard = cards[cards.length - 1]
      if (lastCard) {
        gsap.fromTo(
          lastCard,
          { opacity: 0, y: 15, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
        )
      }
    }
  }, [skeletonCount])

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-8 py-8">
      {/* Brain icon */}
      <div ref={brainRef} className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Brain className="size-10 text-primary" />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">
          {typeMessages[messageIndex]}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Isso pode levar alguns segundos
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            ref={progressRef}
            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
            style={{ width: 0 }}
          />
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="grid w-full max-w-lg grid-cols-2 gap-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            data-skeleton-card
            className="rounded-lg border border-border bg-card p-4"
            style={{ opacity: 0 }}
          >
            <div className="mb-3 h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mb-2 h-2 w-full animate-pulse rounded bg-muted" />
            <div className="h-2 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
