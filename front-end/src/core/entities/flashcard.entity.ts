export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface FlashcardDeck {
  id: string
  topic: string
  subject: string
  cardCount: number
  createdAt: string
  cards: Flashcard[]
}
