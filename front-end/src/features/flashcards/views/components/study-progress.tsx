"use client"

import { Progress } from "@/core/components/ui/progress"

interface StudyProgressProps {
  current: number
  total: number
  known: number
  unknown: number
}

export const StudyProgress = ({
  current,
  total,
  known,
  unknown,
}: StudyProgressProps) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Card {current} de {total}
        </span>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-500">
            Sei: {known}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-500">
            Nao sei: {unknown}
          </span>
        </div>
      </div>
    </div>
  )
}
