"use client"

import { useState, useCallback } from "react"
import { PageContainer } from "@/core/components/layout/page-container"
import { FadeIn } from "@/core/components/animations/fade-in"
import { useCredits } from "@/core/hooks/use-credits"
import { GENERATION_COSTS } from "@/core/constants"
import { PdfDropzone } from "./components/pdf-dropzone"
import { GenerationOptions } from "./components/generation-options"
import { GenerationLoading } from "./components/generation-loading"
import { GenerationResult } from "./components/generation-result"
import type { UploadStep, GenerationType } from "@/features/upload/types"

export const UploadPage = () => {
  const [step, setStep] = useState<UploadStep>("select")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [generationType, setGenerationType] = useState<GenerationType | null>(null)
  const { credits, remaining, consume } = useCredits()

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setStep("options")
  }, [])

  const handleGenerationSelect = useCallback(
    (type: GenerationType) => {
      setGenerationType(type)
      setStep("loading")

      const cost = GENERATION_COSTS[type]
      consume(cost)

      // Simulate AI processing
      const delay = 3500 + Math.random() * 1500
      setTimeout(() => {
        setStep("result")
      }, delay)
    },
    [consume]
  )

  const handleReset = useCallback(() => {
    setStep("select")
    setSelectedFile(null)
    setGenerationType(null)
  }, [])

  const selectedCost = generationType
    ? GENERATION_COSTS[generationType]
    : null

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
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

        {/* Step: Select File */}
        {(step === "select" || step === "options") && (
          <FadeIn>
            <div className="flex flex-col gap-6">
              <PdfDropzone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />

              {/* Generation Options (visible after file selected) */}
              {step === "options" && selectedFile && (
                <FadeIn delay={0.1}>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      O que deseja gerar?
                    </h2>

                    {/* Credit indicator */}
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Voce tem{" "}
                        <span className="font-semibold text-foreground">
                          {remaining} creditos
                        </span>{" "}
                        restantes.{" "}
                        {remaining < GENERATION_COSTS.questions
                          ? "Creditos insuficientes para gerar."
                          : "Escolha uma opcao abaixo."}
                      </p>
                    </div>

                    <GenerationOptions
                      onSelect={handleGenerationSelect}
                      disabled={remaining < GENERATION_COSTS.flashcards}
                    />
                  </div>
                </FadeIn>
              )}
            </div>
          </FadeIn>
        )}

        {/* Step: Loading */}
        {step === "loading" && generationType && (
          <FadeIn>
            <GenerationLoading type={generationType} />
          </FadeIn>
        )}

        {/* Step: Result */}
        {step === "result" && generationType && (
          <FadeIn>
            <GenerationResult
              type={generationType}
              count={generationType === "flashcards" ? 10 : 8}
              topic={
                selectedFile?.name
                  .replace(".pdf", "")
                  .replace(/_/g, " ") ?? "Conteudo"
              }
              deckId="mock-deck-001"
              onReset={handleReset}
            />
          </FadeIn>
        )}
      </div>
    </PageContainer>
  )
}
