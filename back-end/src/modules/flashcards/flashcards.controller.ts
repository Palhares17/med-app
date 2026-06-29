import type { FastifyReply, FastifyRequest } from "fastify";
import { FlashcardError, type FlashcardsService } from "./flashcards.service";
import type { GenerateFlashcardsInput } from "./flashcards.schema";

export class FlashcardsController {
  constructor(private readonly service: FlashcardsService) {}

  generate = async (
    request: FastifyRequest<{ Body: GenerateFlashcardsInput }>,
    reply: FastifyReply,
  ) => {
    try {
      const deck = await this.service.generateFromUpload({
        ...request.body,
        userId: request.user!.id,
      });
      return reply.status(201).send(deck);
    } catch (err) {
      if (err instanceof FlashcardError) {
        return reply.status(err.statusCode).send({ message: err.message });
      }
      throw err;
    }
  };

  findAll = async (request: FastifyRequest, reply: FastifyReply) => {
    const decks = await this.service.findAll(request.user!.id);
    return reply.send(decks);
  };

  findOne = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    try {
      const deck = await this.service.findById(
        request.params.id,
        request.user!.id,
      );
      return reply.send(deck);
    } catch (err) {
      if (err instanceof FlashcardError) {
        return reply.status(err.statusCode).send({ message: err.message });
      }
      throw err;
    }
  };
}
