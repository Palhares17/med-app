import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/core/lib/utils"
import { Button } from "@/core/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Icon className="size-8 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>

      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
