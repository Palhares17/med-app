import { eq } from "drizzle-orm";
import { flashcardDecks, flashcards } from "../../db/schema";
import type { Database } from "../../plugins/db.plugin";

export type DeckRow = typeof flashcardDecks.$inferSelect;
export type FlashcardRow = typeof flashcards.$inferSelect;

export interface CreateDeckInput {
  uploadId: string;
  userId: string | null;
  topic: string;
  subject: string;
  cards: { front: string; back: string }[];
}

export class FlashcardsRepository {
  constructor(private readonly db: Database) {}

  async createDeck(
    input: CreateDeckInput,
  ): Promise<{ deck: DeckRow; cards: FlashcardRow[] }> {
    return this.db.transaction(async (tx) => {
      const [deck] = await tx
        .insert(flashcardDecks)
        .values({
          uploadId: input.uploadId,
          userId: input.userId,
          topic: input.topic,
          subject: input.subject,
          cardCount: input.cards.length,
        })
        .returning();

      const cards = input.cards.length
        ? await tx
            .insert(flashcards)
            .values(
              input.cards.map((card) => ({
                deckId: deck.id,
                front: card.front,
                back: card.back,
              })),
            )
            .returning()
        : [];

      return { deck, cards };
    });
  }

  async findAllDecks(userId: string): Promise<DeckRow[]> {
    return this.db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.userId, userId));
  }

  async findDeckById(id: string): Promise<DeckRow | undefined> {
    const result = await this.db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.id, id));
    return result[0];
  }

  async findCardsByDeckId(deckId: string): Promise<FlashcardRow[]> {
    return this.db
      .select()
      .from(flashcards)
      .where(eq(flashcards.deckId, deckId));
  }
}
