"use client"

import { useState } from "react"
import { Link2, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog"
import { Input } from "@/core/components/ui/input"

interface InviteLinkDialogProps {
  inviteCode: string
  groupName: string
}

export const InviteLinkDialog = ({ inviteCode, groupName }: InviteLinkDialogProps) => {
  const [copied, setCopied] = useState(false)

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/grupos/convite/${inviteCode}`
      : `/grupos/convite/${inviteCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast.success("Link copiado!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Erro ao copiar link")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Link2 className="size-3.5" />
          Convidar membros
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar para {groupName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Compartilhe este link para convidar pessoas para o grupo. A entrada é exclusiva por convite.
          </p>
          <div className="flex gap-2">
            <Input value={inviteUrl} readOnly className="text-sm font-mono" />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Código: <span className="font-mono font-semibold">{inviteCode}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
