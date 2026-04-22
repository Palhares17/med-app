"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface WeeklyTimerProps {
  resetDate: string
  className?: string
}

function getTimeRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

export const WeeklyTimer = ({ resetDate, className }: WeeklyTimerProps) => {
  const [time, setTime] = useState(getTimeRemaining(resetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(resetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [resetDate])

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className={className}>
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
        <Clock className="size-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Reset em</span>
        <div className="flex items-center gap-1">
          {time.days > 0 && (
            <span className="text-sm font-bold text-foreground">
              {time.days}d
            </span>
          )}
          <span className="text-sm font-bold text-foreground">
            {pad(time.hours)}h
          </span>
          <span className="text-sm font-bold text-foreground">
            {pad(time.minutes)}m
          </span>
          <span className="text-sm font-mono text-muted-foreground">
            {pad(time.seconds)}s
          </span>
        </div>
      </div>
    </div>
  )
}
