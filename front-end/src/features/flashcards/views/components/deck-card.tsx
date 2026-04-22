"use client"

import { useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Layers, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import type { FlashcardDeck } from "@/core/entities/flashcard.entity"
import { Badge } from "@/core/components/ui/badge"

interface DeckCardProps {
  deck: FlashcardDeck
}

export const DeckCard = ({ deck }: DeckCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null)

  useGSAP(() => {
    const el = cardRef.current
    if (!el) return

    const handleMouseEnter = () => {
      gsap.to(el, {
        scale: 1.03,
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        scale: 1,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        duration: 0.3,
        ease: "power2.out",
      })
    }

    el.addEventListener("mouseenter", handleMouseEnter)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, { scope: cardRef })

  const formattedDate = format(new Date(deck.createdAt), "dd MMM yyyy", {
    locale: ptBR,
  })

  return (
    <Link
      ref={cardRef}
      href={`/flashcards/${deck.id}`}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="size-4" />
            <span className="text-sm">{deck.cardCount} cards</span>
          </div>
          <Badge variant="secondary">{deck.subject}</Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {deck.topic}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}
