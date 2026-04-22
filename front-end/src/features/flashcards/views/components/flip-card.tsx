"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface FlipCardProps {
  front: string
  back: string
  isFlipped: boolean
  onFlip: () => void
}

export const FlipCard = ({ front, back, isFlipped, onFlip }: FlipCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!frontRef.current || !backRef.current) return

    // Set initial state without animation
    if (isFirstRender.current) {
      gsap.set(frontRef.current, { rotateY: 0 })
      gsap.set(backRef.current, { rotateY: 180 })
      isFirstRender.current = false
      return
    }

    const tl = gsap.timeline()

    if (isFlipped) {
      tl.to(frontRef.current, {
        rotateY: 180,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0)
      tl.to(backRef.current, {
        rotateY: 360,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0)
    } else {
      tl.to(frontRef.current, {
        rotateY: 0,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0)
      tl.to(backRef.current, {
        rotateY: 180,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0)
    }
  }, [isFlipped])

  return (
    <div
      ref={cardRef}
      onClick={onFlip}
      className="relative mx-auto h-72 w-full max-w-lg cursor-pointer sm:h-80"
      style={{ perspective: "1000px" }}
    >
      {/* Front face */}
      <div
        ref={frontRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-lg"
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      >
        <p className="text-center text-lg font-medium text-foreground leading-relaxed">
          {front}
        </p>
        <span className="mt-2 text-xs text-muted-foreground">
          Toque para virar
        </span>
      </div>

      {/* Back face */}
      <div
        ref={backRef}
        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 p-8 shadow-lg"
        style={{
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          transform: "rotateY(180deg)",
        }}
      >
        <p className="text-center text-lg font-medium text-foreground leading-relaxed">
          {back}
        </p>
      </div>
    </div>
  )
}
