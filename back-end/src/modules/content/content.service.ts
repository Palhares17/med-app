import crypto from "node:crypto";
import type { ContentRepository } from "./content.repository";
import {
  generateFlashcards,
  generateQuestions,
} from "../../core/services/ai.service";

export class ContentService {
  constructor(private readonly repository: ContentRepository) {}

  private topicHash(topic: string): string {
    return crypto
      .createHash("sha256")
      .update(topic.trim().toLowerCase())
      .digest("hex");
  }

  async generateFlashcards(
    userId: string,
    pdfId: string | undefined,
    pdfText: string,
    topic: string,
    subject: string
  ) {
    const hash = this.topicHash(topic);

    // Reuse existing topic if any
    let topicRecord = await this.repository.findTopicByHash(hash);
    if (!topicRecord) {
      topicRecord = await this.repository.createTopic({ hash, topic, subject });
    }

    // Reuse existing flashcards for this topic (RF-014, RF-015)
    let cards = await this.repository.getFlashcardsForTopic(topicRecord.id);
    if (cards.length === 0) {
      const generated = await generateFlashcards(pdfText, topic, 10);
      cards = await this.repository.createFlashcards(topicRecord.id, generated);
    }

    // Create a deck for this user
    const deck = await this.repository.createFlashcardDeck({
      topicId: topicRecord.id,
      pdfId,
      userId,
    });

    return { deck, topic: topicRecord, cards };
  }

  async generateQuestions(
    userId: string,
    pdfId: string | undefined,
    pdfText: string,
    topic: string,
    subject: string
  ) {
    const hash = this.topicHash(topic);

    let topicRecord = await this.repository.findTopicByHash(hash);
    if (!topicRecord) {
      topicRecord = await this.repository.createTopic({ hash, topic, subject });
    }

    let qs = await this.repository.getQuestionsForTopic(topicRecord.id);
    if (qs.length === 0) {
      const generated = await generateQuestions(pdfText, topic, 8);
      qs = await this.repository.createQuestions(topicRecord.id, generated);
    }

    const qSet = await this.repository.createQuestionSet({
      topicId: topicRecord.id,
      pdfId,
      userId,
    });

    return { questionSet: qSet, topic: topicRecord, questions: qs };
  }

  async listFlashcardDecks(userId: string) {
    const decks = await this.repository.getFlashcardDecksByUser(userId);
    const result = await Promise.all(
      decks.map(async (deck) => {
        const topic = await this.repository.getTopicById(deck.topicId);
        const cards = await this.repository.getFlashcardsForTopic(deck.topicId);
        return { ...deck, topic, cards };
      })
    );
    return result;
  }

  async getFlashcardDeck(deckId: string) {
    const deck = await this.repository.getFlashcardDeckById(deckId);
    if (!deck) return null;
    const topic = await this.repository.getTopicById(deck.topicId);
    const cards = await this.repository.getFlashcardsForTopic(deck.topicId);
    return { ...deck, topic, cards };
  }

  async listQuestionSets(userId: string) {
    const sets = await this.repository.getQuestionSetsByUser(userId);
    const result = await Promise.all(
      sets.map(async (qs) => {
        const topic = await this.repository.getTopicById(qs.topicId);
        const questions = await this.repository.getQuestionsForTopic(qs.topicId);
        return { ...qs, topic, questions };
      })
    );
    return result;
  }

  async getQuestionSet(setId: string) {
    const qs = await this.repository.getQuestionSetById(setId);
    if (!qs) return null;
    const topic = await this.repository.getTopicById(qs.topicId);
    const questions = await this.repository.getQuestionsForTopic(qs.topicId);
    return { ...qs, topic, questions };
  }

  async getQuestion(questionId: string) {
    return this.repository.getQuestionById(questionId);
  }
}
