"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
}

export const AnimatedCounter = ({
  value,
  duration = 1.5,
  delay = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) => {
  const container = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)

  useGSAP(() => {
    const proxy = { val: 0 }

    gsap.to(proxy, {
      val: value,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayValue(Math.round(proxy.val))
      },
    })
  }, { dependencies: [value] })

  return (
    <span ref={container} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
