"use client"

import { useAuth } from "@/core/hooks/use-auth"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar"
import { Badge } from "@/core/components/ui/badge"
import { apiGet } from "@/core/lib/api"
import { useEffect, useState } from "react"
import { Medal } from "lucide-react"

interface MedalData {
  id: string
  type: "gold" | "silver" | "bronze"
  weekStart: string
  groupId: string
}

const medalColors = {
  gold: "text-yellow-500 bg-yellow-500/10",
  silver: "text-slate-400 bg-slate-400/10",
  bronze: "text-orange-600 bg-orange-600/10",
}
const medalLabels = { gold: "Ouro", silver: "Prata", bronze: "Bronze" }

export default function PerfilPage() {
  const { user } = useAuth()
  const [medals, setMedals] = useState<MedalData[]>([])

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "MB"

  useEffect(() => {
    apiGet<MedalData[]>("/users/me")
      .then((data: any) => setMedals(data.medals ?? []))
      .catch(() => {})
  }, [])

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <FadeIn>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Meu Perfil</h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-6">
            <Avatar className="size-20">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2 w-fit">
                Plano {user?.plan === "free" ? "Gratuito" : "Pago"}
              </Badge>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Medal className="size-5 text-primary" /> Histórico de Medalhas
            </h3>
            {medals.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma medalha conquistada ainda. Participe de grupos e dispute o ranking semanal!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {medals.map((m) => (
                  <div key={m.id} className={`flex items-center gap-2 rounded-lg px-4 py-2 ${medalColors[m.type]}`}>
                    <Medal className="size-4" />
                    <span className="text-sm font-semibold">{medalLabels[m.type]}</span>
                    <span className="text-xs opacity-70">{new Date(m.weekStart).toLocaleDateString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </PageContainer>
  )
}
