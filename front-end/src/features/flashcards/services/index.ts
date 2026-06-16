import { apiGet, apiPost } from "@/core/lib/api"
import type { FlashcardDeck } from "@/core/entities/flashcard.entity"

export interface ApiFlashcardDeck {
  id: string
  topicId: string
  userId: string
  createdAt: string
  topic: { id: string; topic: string; subject: string }
  cards: Array<{ id: string; front: string; back: string }>
}

function toDeck(d: ApiFlashcardDeck): FlashcardDeck {
  return {
    id: d.id,
    topic: d.topic?.topic ?? "Sem tópico",
    subject: d.topic?.subject ?? "Geral",
    cardCount: d.cards?.length ?? 0,
    createdAt: d.createdAt,
    cards: d.cards ?? [],
  }
}

export async function listFlashcardDecks(): Promise<FlashcardDeck[]> {
  const data = await apiGet<ApiFlashcardDeck[]>("/content/flashcards")
  return data.map(toDeck)
}

export async function getFlashcardDeck(id: string): Promise<FlashcardDeck> {
  const data = await apiGet<ApiFlashcardDeck>(`/content/flashcards/${id}`)
  return toDeck(data)
}

export async function generateFlashcards(payload: {
  pdfText: string
  topic: string
  subject?: string
  pdfId?: string
}): Promise<{ deck: { id: string }; cards: unknown[] }> {
  return apiPost("/content/flashcards/generate", payload)
}
