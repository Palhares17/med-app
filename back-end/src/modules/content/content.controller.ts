import type { FastifyReply, FastifyRequest } from "fastify";
import type { ContentService } from "./content.service";

interface GenerateBody {
  pdfId?: string;
  pdfText: string;
  topic: string;
  subject?: string;
}

export class ContentController {
  constructor(private readonly service: ContentService) {}

  generateFlashcards = async (
    request: FastifyRequest<{ Body: GenerateBody }>,
    reply: FastifyReply
  ) => {
    const { pdfId, pdfText, topic, subject = "Geral" } = request.body;
    const result = await this.service.generateFlashcards(
      request.userId,
      pdfId,
      pdfText,
      topic,
      subject
    );
    return reply.status(201).send(result);
  };

  generateQuestions = async (
    request: FastifyRequest<{ Body: GenerateBody }>,
    reply: FastifyReply
  ) => {
    const { pdfId, pdfText, topic, subject = "Geral" } = request.body;
    const result = await this.service.generateQuestions(
      request.userId,
      pdfId,
      pdfText,
      topic,
      subject
    );
    return reply.status(201).send(result);
  };

  listFlashcardDecks = async (request: FastifyRequest, reply: FastifyReply) => {
    const decks = await this.service.listFlashcardDecks(request.userId);
    return reply.send(decks);
  };

  getFlashcardDeck = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const deck = await this.service.getFlashcardDeck(request.params.id);
    if (!deck) return reply.status(404).send({ error: "Deck não encontrado" });
    return reply.send(deck);
  };

  listQuestionSets = async (request: FastifyRequest, reply: FastifyReply) => {
    const sets = await this.service.listQuestionSets(request.userId);
    return reply.send(sets);
  };

  getQuestionSet = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const qs = await this.service.getQuestionSet(request.params.id);
    if (!qs) return reply.status(404).send({ error: "Conjunto não encontrado" });
    return reply.send(qs);
  };
}
