"use client"

import Link from "next/link"
import { Upload } from "lucide-react"
import { FadeIn } from "@/core/components/animations/fade-in"
import { PageContainer } from "@/core/components/layout/page-container"
import { useAuth } from "@/core/hooks/use-auth"
import { ROUTES } from "@/core/constants"
import { Button } from "@/core/components/ui/button"
import { StatsCards } from "./components/stats-cards"
import { RecentActivity } from "./components/recent-activity"
import { CreditOverview } from "./components/credit-overview"

export const DashboardPage = () => {
  const { user } = useAuth()
  const firstName = user?.name.split(" ")[0] ?? "Estudante"

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        {/* Greeting */}
        <FadeIn>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Ola, {firstName} 👋
              </h1>
              <p className="mt-1 text-muted-foreground">
                Confira seu progresso e continue estudando
              </p>
            </div>
            <Button asChild className="mt-4 gap-2 sm:mt-0">
              <Link href={ROUTES.UPLOAD}>
                <Upload className="size-4" />
                Enviar novo PDF
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Stats Row */}
        <StatsCards />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity - wider */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Credit Overview - sidebar */}
          <div className="lg:col-span-1">
            <CreditOverview />
          </div>
        </div>

        {/* Quick Action Card */}
        <FadeIn delay={0.5}>
          <Link href={ROUTES.UPLOAD} className="group block">
            <div className="flex items-center gap-5 rounded-xl border border-dashed border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-primary/5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Upload className="size-7 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Enviar novo PDF
                </h3>
                <p className="text-sm text-muted-foreground">
                  Transforme seu material de estudo em flashcards ou questoes com IA
                </p>
              </div>
            </div>
          </Link>
        </FadeIn>
      </div>
    </PageContainer>
  )
}
