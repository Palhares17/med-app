"use client"

import { useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/core/lib/utils"
import { UPLOAD_LIMITS } from "@/core/constants"

interface PdfDropzoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export const PdfDropzone = ({ onFileSelect, selectedFile }: PdfDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const fileInfoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const animateDragEnter = useCallback(() => {
    if (dropzoneRef.current) {
      gsap.to(dropzoneRef.current, {
        scale: 1.02,
        borderColor: "hsl(var(--primary))",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [])

  const animateDragLeave = useCallback(() => {
    if (dropzoneRef.current) {
      gsap.to(dropzoneRef.current, {
        scale: 1,
        borderColor: "hsl(var(--border))",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [])

  const animateFileInfo = useCallback(() => {
    if (fileInfoRef.current) {
      gsap.fromTo(
        fileInfoRef.current,
        { opacity: 0, y: 10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
      )
    }
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      if (!(UPLOAD_LIMITS.allowedTypes as readonly string[]).includes(file.type)) return
      onFileSelect(file)
      setTimeout(animateFileInfo, 50)
    },
    [onFileSelect, animateFileInfo]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!isDragOver) {
        setIsDragOver(true)
        animateDragEnter()
      }
    },
    [isDragOver, animateDragEnter]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      animateDragLeave()
    },
    [animateDragLeave]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      animateDragLeave()

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile, animateDragLeave]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  if (selectedFile) {
    return (
      <div ref={fileInfoRef} className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <FileText className="size-7 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {selectedFile.name}
            </p>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span>~45 paginas</span>
            </div>
          </div>
          <button
            onClick={() => {
              onFileSelect(null as unknown as File)
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleInputChange}
        className="hidden"
      />
      <div
        ref={dropzoneRef}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/50 hover:bg-muted/30"
        )}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Upload className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-foreground">
            Arraste seu PDF aqui ou clique para selecionar
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Apenas arquivos PDF ate {UPLOAD_LIMITS.maxFileSizeMB}MB
          </p>
        </div>
      </div>
    </>
  )
}
