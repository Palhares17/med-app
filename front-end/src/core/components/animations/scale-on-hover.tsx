"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface ScaleOnHoverProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export const ScaleOnHover = ({
  children,
  scale = 1.03,
  className,
}: ScaleOnHoverProps) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = container.current
    if (!el) return

    const handleMouseEnter = () => {
      gsap.to(el, {
        scale,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        scale: 1,
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
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
  }, { scope: container })

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  )
}
