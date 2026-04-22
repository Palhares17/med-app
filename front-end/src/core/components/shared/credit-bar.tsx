"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/core/lib/utils"

interface CreditBarProps {
  used: number
  total: number
  showLabel?: boolean
  className?: string
}

export const CreditBar = ({ used, total, showLabel = false, className }: CreditBarProps) => {
  const barRef = useRef<HTMLDivElement>(null)
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0

  useGSAP(() => {
    if (!barRef.current) return

    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      {
        width: `${percentage}%`,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      }
    )
  }, { dependencies: [percentage] })

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Créditos</span>
          <span className="text-xs font-semibold text-foreground">
            {used} de {total} créditos
          </span>
        </div>
      )}

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: 0 }}
        />
      </div>
    </div>
  )
}
