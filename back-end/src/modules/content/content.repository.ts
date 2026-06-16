import {
  topics,
  flashcards,
  flashcardDecks,
  questions,
  questionSets,
} from "../../db/schema";
import { eq, inArray } from "drizzle-orm";
import type { Database } from "../../plugins/db.plugin";
import type { GeneratedFlashcard, GeneratedQuestion } from "../../core/services/ai.service";

export class ContentRepository {
  constructor(private readonly db: Database) {}

  async findTopicByHash(hash: string) {
    const [t] = await this.db.select().from(topics).where(eq(topics.hash, hash));
    return t ?? null;
  }

  async createTopic(data: { hash: string; topic: string; subject: string }) {
    const [t] = await this.db.insert(topics).values(data).returning();
    return t;
  }

  async getFlashcardsForTopic(topicId: string) {
    return this.db.select().from(flashcards).where(eq(flashcards.topicId, topicId));
  }

  async createFlashcards(topicId: string, cards: GeneratedFlashcard[]) {
    const rows = cards.map((c) => ({ topicId, front: c.front, back: c.back }));
    return this.db.insert(flashcards).values(rows).returning();
  }

  async createFlashcardDeck(data: { topicId: string; pdfId?: string | null; userId: string }) {
    const [deck] = await this.db.insert(flashcardDecks).values(data).returning();
    return deck;
  }

  async getFlashcardDecksByUser(userId: string) {
    const decks = await this.db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.userId, userId));
    return decks;
  }

  async getFlashcardDeckById(deckId: string) {
    const [deck] = await this.db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.id, deckId));
    return deck ?? null;
  }

  async getTopicById(topicId: string) {
    const [t] = await this.db.select().from(topics).where(eq(topics.id, topicId));
    return t ?? null;
  }

  async getQuestionsForTopic(topicId: string) {
    return this.db.select().from(questions).where(eq(questions.topicId, topicId));
  }

  async createQuestions(topicId: string, qs: GeneratedQuestion[]) {
    const rows = qs.map((q) => ({
      topicId,
      question: q.question,
      alternatives: q.alternatives,
      explanation: q.explanation,
    }));
    return this.db.insert(questions).values(rows).returning();
  }

  async createQuestionSet(data: { topicId: string; pdfId?: string | null; userId: string }) {
    const [qs] = await this.db.insert(questionSets).values(data).returning();
    return qs;
  }

  async getQuestionSetsByUser(userId: string) {
    return this.db
      .select()
      .from(questionSets)
      .where(eq(questionSets.userId, userId));
  }

  async getQuestionSetById(setId: string) {
    const [qs] = await this.db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, setId));
    return qs ?? null;
  }

  async getQuestionById(questionId: string) {
    const [q] = await this.db.select().from(questions).where(eq(questions.id, questionId));
    return q ?? null;
  }
}
