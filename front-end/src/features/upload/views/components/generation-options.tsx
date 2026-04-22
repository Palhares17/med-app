"use client"

import { useRef, useCallback } from "react"
import gsap from "gsap"
import { Layers, ListChecks } from "lucide-react"
import { cn } from "@/core/lib/utils"
import { GENERATION_COSTS } from "@/core/constants"
import type { GenerationType } from "@/features/upload/types"

interface GenerationOptionsProps {
  onSelect: (type: GenerationType) => void
  disabled: boolean
}

interface OptionCardProps {
  type: GenerationType
  title: string
  description: string
  icon: React.ReactNode
  cost: number
  disabled: boolean
  onSelect: (type: GenerationType) => void
}

const OptionCard = ({
  type,
  title,
  description,
  icon,
  cost,
  disabled,
  onSelect,
}: OptionCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current && !disabled) {
      gsap.to(cardRef.current, {
        scale: 1.03,
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [disabled])

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [])

  return (
    <button
      ref={cardRef}
      onClick={() => !disabled && onSelect(type)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-primary/50"
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-full bg-muted px-3 py-1">
        <span className="text-xs font-medium text-muted-foreground">
          ~{cost} creditos
        </span>
      </div>
    </button>
  )
}

export const GenerationOptions = ({ onSelect, disabled }: GenerationOptionsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <OptionCard
        type="flashcards"
        title="Gerar Flashcards"
        description="Crie cards de estudo com frente e verso"
        icon={<Layers className="size-8 text-primary" />}
        cost={GENERATION_COSTS.flashcards}
        disabled={disabled}
        onSelect={onSelect}
      />
      <OptionCard
        type="questions"
        title="Gerar Questoes"
        description="Crie questoes objetivas com 4 alternativas"
        icon={<ListChecks className="size-8 text-primary" />}
        cost={GENERATION_COSTS.questions}
        disabled={disabled}
        onSelect={onSelect}
      />
    </div>
  )
}
