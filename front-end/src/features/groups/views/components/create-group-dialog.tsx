"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Plus, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/core/components/ui/dialog"
import type { Group } from "@/core/entities/group.entity"
import { mockUser } from "@/core/mocks/user.mock"

const createGroupSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().max(200, "A descrição deve ter no máximo 200 caracteres").optional(),
})

type FormData = z.infer<typeof createGroupSchema>

interface CreateGroupDialogProps {
  onGroupCreated: (group: Group) => void
}

export const CreateGroupDialog = ({ onGroupCreated }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useGSAP(() => {
    if (!open || !contentRef.current) return

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
    )
  }, { dependencies: [open] })

  const onSubmit = async (data: FormData) => {
    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: data.name,
      description: data.description ?? "",
      memberCount: 1,
      createdAt: new Date().toISOString(),
      createdBy: mockUser.id,
      inviteCode: `GRP-${code}`,
      members: [
        {
          id: mockUser.id,
          name: mockUser.name,
          avatar: mockUser.avatar,
          weeklyScore: 0,
          weeklyAnswered: 0,
          position: 1,
        },
      ],
      weeklyReset: new Date(
        Date.now() + (7 - new Date().getDay()) * 86400000
      ).toISOString(),
    }

    onGroupCreated(newGroup)
    setIsCreating(false)
    setOpen(false)
    reset()
    toast.success("Grupo criado com sucesso!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Criar Grupo
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Criar novo grupo</DialogTitle>
          <DialogDescription>
            Crie um grupo de estudos e convide seus colegas para competir no ranking semanal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do grupo</Label>
            <Input
              id="name"
              placeholder="Ex: Turma Medicina 2025"
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Descrição{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="description"
              placeholder="Descreva o objetivo do grupo..."
              {...register("description", {
                maxLength: { value: 200, message: "Máximo 200 caracteres" },
              })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isCreating} className="mt-2">
            {isCreating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Grupo"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
