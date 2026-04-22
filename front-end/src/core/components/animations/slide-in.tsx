"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

type Direction = "left" | "right" | "top" | "bottom"

interface SlideInProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  distance?: number
  className?: string
}

function getInitialPosition(direction: Direction, distance: number) {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 }
    case "right":
      return { x: distance, y: 0 }
    case "top":
      return { x: 0, y: -distance }
    case "bottom":
      return { x: 0, y: distance }
  }
}

export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = 0.6,
  distance = 60,
  className,
}: SlideInProps) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const { x, y } = getInitialPosition(direction, distance)

    gsap.fromTo(
      container.current,
      { opacity: 0, x, y },
      { opacity: 1, x: 0, y: 0, duration, delay, ease: "power2.out" }
    )
  }, { scope: container })

  return (
    <div ref={container} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
