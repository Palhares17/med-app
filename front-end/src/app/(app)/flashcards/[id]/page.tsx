"use client"

import { use } from "react"
import { FlashcardStudyPage } from "@/features/flashcards/views/flashcard-study.page"

export default function FlashcardStudy({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <FlashcardStudyPage deckId={id} />
}
