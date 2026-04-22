"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Zap, ArrowUpRight } from "lucide-react"
import { CreditBar } from "@/core/components/shared/credit-bar"
import { useCredits } from "@/core/hooks/use-credits"
import { FadeIn } from "@/core/components/animations/fade-in"
import { Button } from "@/core/components/ui/button"

export const CreditOverview = () => {
  const { credits, remaining } = useCredits()
  const planLabel = credits.plan === "free" ? "Gratuito" : "Pago"
  const resetDate = format(new Date(credits.resetDate), "dd 'de' MMMM", {
    locale: ptBR,
  })

  return (
    <FadeIn delay={0.3}>
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Creditos</h3>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <Zap className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Plano {planLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          <CreditBar used={credits.used} total={credits.total} showLabel />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Restantes</span>
            <span className="font-semibold text-foreground">
              {remaining} creditos
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Renovacao</span>
            <span className="font-medium text-foreground">{resetDate}</span>
          </div>

          {credits.plan === "free" && (
            <Button className="mt-1 w-full gap-2" variant="default">
              <ArrowUpRight className="size-4" />
              Fazer Upgrade
            </Button>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
