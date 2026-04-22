"use client"

import { useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Link2, Copy, Check, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/core/components/ui/dialog"

interface InviteLinkDialogProps {
  inviteCode: string
  groupName: string
}

export const InviteLinkDialog = ({
  inviteCode,
  groupName,
}: InviteLinkDialogProps) => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const inviteLink = `medbrain.com/convite/${inviteCode}`

  useGSAP(
    () => {
      if (!open || !contentRef.current) return

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      )
    },
    { dependencies: [open] }
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)

      if (iconRef.current) {
        gsap.fromTo(
          iconRef.current,
          { scale: 0.5, rotate: -20 },
          { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(1.7)" }
        )
      }

      toast.success("Link copiado!")
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error("Erro ao copiar link")
    }
  }, [inviteLink])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="size-4" />
          Convidar
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Convidar para {groupName}</DialogTitle>
          <DialogDescription>
            Compartilhe o link abaixo para convidar pessoas para o grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <Link2 className="size-5 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Link de convite</p>
              <p className="truncate text-sm font-medium text-foreground">
                {inviteLink}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              readOnly
              value={inviteLink}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleCopy}
              variant={copied ? "default" : "outline"}
              className="shrink-0 gap-2"
            >
              <div ref={iconRef}>
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </div>
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Qualquer pessoa com este link poderá entrar no grupo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
