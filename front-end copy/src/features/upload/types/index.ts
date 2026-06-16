export type GenerationType = "flashcards" | "questions"

export type UploadStep = "select" | "options" | "loading" | "result"

export interface UploadState {
  step: UploadStep
  file: File | null
  generationType: GenerationType | null
  isProcessing: boolean
  error: string | null
}

export interface GenerationResultData {
  type: GenerationType
  count: number
  topic: string
  deckId: string
  creditsUsed: number
}
