"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Sparkles } from "lucide-react"

export const LoadingScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!logoRef.current || !textRef.current) return

    const tl = gsap.timeline({ repeat: -1, yoyo: true })

    tl.fromTo(
      logoRef.current,
      { scale: 0.95, opacity: 0.7 },
      { scale: 1.05, opacity: 1, duration: 1.2, ease: "sine.inOut" }
    )

    gsap.fromTo(
      textRef.current,
      { opacity: 0.5 },
      { opacity: 1, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" }
    )
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background"
    >
      <div ref={logoRef} className="flex items-center gap-3">
        <Sparkles className="size-10 text-primary" />
        <span ref={textRef} className="text-3xl font-bold text-foreground">
          MedBrain
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
        <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
        <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
      </div>

      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  )
}
