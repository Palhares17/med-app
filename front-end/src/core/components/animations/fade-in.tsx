"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}

export const FadeIn = ({ children, delay = 0, duration = 0.6, y = 30, className }: FadeInProps) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      container.current,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
    )
  }, { scope: container })

  return (
    <div ref={container} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
