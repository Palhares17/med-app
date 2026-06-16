import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authMiddleware } from "../../core/middlewares/auth.middleware";

export const groupsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook("preHandler", authMiddleware);

  app.post("/", {
    schema: {
      tags: ["groups"],
      body: z.object({ name: z.string().min(1), description: z.string().default("") }),
    },
  }, app.groups.controller.create);

  app.get("/", { schema: { tags: ["groups"] } }, app.groups.controller.list);

  app.get("/:id", {
    schema: { tags: ["groups"], params: z.object({ id: z.string() }) },
  }, app.groups.controller.getDetail);

  app.delete("/:id", {
    schema: { tags: ["groups"], params: z.object({ id: z.string() }) },
  }, app.groups.controller.deleteGroup);

  app.post("/join/:code", {
    schema: { tags: ["groups"], params: z.object({ code: z.string() }) },
  }, app.groups.controller.joinByCode);

  app.delete("/:id/members/:memberId", {
    schema: {
      tags: ["groups"],
      params: z.object({ id: z.string(), memberId: z.string() }),
    },
  }, app.groups.controller.removeMember);

  app.get("/:id/ranking", {
    schema: { tags: ["groups"], params: z.object({ id: z.string() }) },
  }, app.groups.controller.getRanking);
};
