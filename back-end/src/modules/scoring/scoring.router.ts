import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authMiddleware } from "../../core/middlewares/auth.middleware";

export const scoringRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook("preHandler", authMiddleware);

  app.post("/answers", {
    schema: {
      tags: ["scoring"],
      body: z.object({
        questionId: z.string(),
        selectedAlternativeId: z.string(),
        groupId: z.string().optional(),
      }),
    },
  }, app.scoring.controller.submit);

  app.get("/answers/history", {
    schema: { tags: ["scoring"] },
  }, app.scoring.controller.history);
};
