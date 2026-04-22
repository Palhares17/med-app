import { cn } from "@/core/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}
