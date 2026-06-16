"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { ROUTES } from "@/core/constants"
import { PdfDropzone } from "./components/pdf-dropzone"
import { GenerationOptions } from "./components/generation-options"
import { GenerationLoading } from "./components/generation-loading"
import { GenerationResult } from "./components/generation-result"
import { generateFlashcards } from "@/features/flashcards/services"
import { generateQuestions } from "@/features/questions/services"
import type { UploadStep, GenerationType } from "@/features/upload/types"

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(",")[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function extractTopicFromFilename(filename: string): Promise<string> {
  return filename.replace(/\.pdf$/i, "").replace(/[_-]/g, " ").trim()
}

export const UploadPage = () => {
  const router = useRouter()
  const [step, setStep] = useState<UploadStep>("select")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [generationType, setGenerationType] = useState<GenerationType | null>(null)
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setStep("options")
  }, [])

  const handleGenerationSelect = useCallback(
    async (type: GenerationType) => {
      if (!selectedFile) return
      setGenerationType(type)
      setStep("loading")
      setIsGenerating(true)

      try {
        const base64Content = await fileToBase64(selectedFile)
        const topic = await extractTopicFromFilename(selectedFile.name)

        if (type === "flashcards") {
          const result = await generateFlashcards({
            pdfText: "", // backend will use OpenAI to extract text from PDF via base64
            topic,
            subject: "Geral",
          })
          setGeneratedId(result.deck.id)
        } else {
          const result = await generateQuestions({
            pdfText: "",
            topic,
            subject: "Geral",
          })
          setGeneratedId(result.questionSet.id)
        }

        setStep("result")
      } catch (err: any) {
        toast.error(err.message ?? "Erro ao gerar conteúdo")
        setStep("options")
      } finally {
        setIsGenerating(false)
      }
    },
    [selectedFile]
  )

  const handleReset = useCallback(() => {
    setStep("select")
    setSelectedFile(null)
    setGenerationType(null)
    setGeneratedId(null)
  }, [])

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Enviar PDF
            </h1>
            <p className="mt-1 text-muted-foreground">
              Faca upload do seu material e gere conteudo de estudo com IA
            </p>
          </div>
        </FadeIn>

        {(step === "select" || step === "options") && (
          <FadeIn>
            <div className="flex flex-col gap-6">
              <PdfDropzone onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              {step === "options" && selectedFile && (
                <FadeIn delay={0.1}>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      O que deseja gerar?
                    </h2>
                    <GenerationOptions onSelect={handleGenerationSelect} disabled={isGenerating} />
                  </div>
                </FadeIn>
              )}
            </div>
          </FadeIn>
        )}

        {step === "loading" && generationType && (
          <FadeIn><GenerationLoading type={generationType} /></FadeIn>
        )}

        {step === "result" && generationType && generatedId && (
          <FadeIn>
            <GenerationResult
              type={generationType}
              count={generationType === "flashcards" ? 10 : 8}
              topic={selectedFile?.name.replace(".pdf", "").replace(/_/g, " ") ?? "Conteudo"}
              deckId={generatedId}
              onReset={handleReset}
            />
          </FadeIn>
        )}
      </div>
    </PageContainer>
  )
}
