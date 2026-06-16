"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface StaggerChildrenProps {
  children: React.ReactNode
  stagger?: number
  delay?: number
  duration?: number
  y?: number
  className?: string
}

export const StaggerChildren = ({
  children,
  stagger = 0.1,
  delay = 0,
  duration = 0.5,
  y = 20,
  className,
}: StaggerChildrenProps) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const childElements = container.current?.querySelectorAll(":scope > *")

    if (!childElements || childElements.length === 0) return

    gsap.fromTo(
      childElements,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power2.out",
      }
    )
  }, { scope: container })

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  )
}
