import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authMiddleware } from "../../core/middlewares/auth.middleware";

const GenerateSchema = z.object({
  pdfId: z.string().optional(),
  pdfText: z.string().min(1),
  topic: z.string().min(1),
  subject: z.string().optional(),
});

export const contentRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook("preHandler", authMiddleware);

  app.post("/flashcards/generate", {
    schema: { tags: ["content"], body: GenerateSchema },
  }, app.content.controller.generateFlashcards);

  app.get("/flashcards", {
    schema: { tags: ["content"] },
  }, app.content.controller.listFlashcardDecks);

  app.get("/flashcards/:id", {
    schema: { tags: ["content"], params: z.object({ id: z.string() }) },
  }, app.content.controller.getFlashcardDeck);

  app.post("/questions/generate", {
    schema: { tags: ["content"], body: GenerateSchema },
  }, app.content.controller.generateQuestions);

  app.get("/questions", {
    schema: { tags: ["content"] },
  }, app.content.controller.listQuestionSets);

  app.get("/questions/:id", {
    schema: { tags: ["content"], params: z.object({ id: z.string() }) },
  }, app.content.controller.getQuestionSet);
};
