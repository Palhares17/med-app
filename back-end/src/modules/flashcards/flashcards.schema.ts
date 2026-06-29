import { z } from "zod";

export const GenerateFlashcardsSchema = z.object({
  uploadId: z.uuid(),
  count: z.number().int().min(1).max(50).optional(),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsSchema>;

// Espelha a entidade Flashcard do front-end.
export const FlashcardSchema = z.object({
  id: z.uuid(),
  front: z.string(),
  back: z.string(),
});

// Espelha a entidade FlashcardDeck do front-end (+ uploadId de origem).
export const DeckResponseSchema = z.object({
  id: z.uuid(),
  uploadId: z.uuid(),
  topic: z.string(),
  subject: z.string(),
  cardCount: z.number().int(),
  createdAt: z.string(),
  cards: z.array(FlashcardSchema),
});
export type DeckResponse = z.infer<typeof DeckResponseSchema>;

// Resumo usado na listagem (sem os cards).
export const DeckSummarySchema = DeckResponseSchema.omit({ cards: true });
export type DeckSummary = z.infer<typeof DeckSummarySchema>;

export const DeckParamsSchema = z.object({
  id: z.uuid(),
});
