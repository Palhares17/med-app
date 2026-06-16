"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { joinGroupByCode } from "@/features/groups/services"
import { toast } from "sonner"
import { LoadingScreen } from "@/core/components/shared/loading-screen"
import { ROUTES } from "@/core/constants"

export default function ConvitePage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params)
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading")

  useEffect(() => {
    joinGroupByCode(codigo)
      .then((group) => {
        toast.success(`Você entrou em "${group.name}"!`)
        router.push(ROUTES.GROUP_DETAIL(group.id))
      })
      .catch((err) => {
        toast.error(err.message ?? "Código de convite inválido")
        router.push(ROUTES.GROUPS)
      })
  }, [codigo, router])

  return <LoadingScreen />
}
