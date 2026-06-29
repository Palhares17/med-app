import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  GenerateFlashcardsSchema,
  DeckResponseSchema,
  DeckSummarySchema,
  DeckParamsSchema,
} from "./flashcards.schema";

export const flashcardsRoutes: FastifyPluginAsyncZod = async (app) => {
  // Todas as rotas de flashcards exigem usuário autenticado.
  app.addHook("preHandler", app.authenticate);

  app.post(
    "/",
    {
      schema: {
        tags: ["flashcards"],
        summary: "Gera um deck de flashcards (via IA) a partir de um upload",
        body: GenerateFlashcardsSchema,
        response: { 201: DeckResponseSchema },
      },
    },
    app.flashcards.controller.generate,
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["flashcards"],
        summary: "Lista os decks de flashcards",
        response: { 200: z.array(DeckSummarySchema) },
      },
    },
    app.flashcards.controller.findAll,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["flashcards"],
        summary: "Detalha um deck com seus cards",
        params: DeckParamsSchema,
        response: { 200: DeckResponseSchema },
      },
    },
    app.flashcards.controller.findOne,
  );
};
