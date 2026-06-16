import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authMiddleware } from "../../core/middlewares/auth.middleware";
import { UploadPdfSchema, PdfResponseSchema } from "./pdfs.schema";

export const pdfsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook("preHandler", authMiddleware);

  app.post("/", {
    schema: {
      tags: ["pdfs"],
      body: UploadPdfSchema,
      response: { 201: PdfResponseSchema },
    },
  }, app.pdfs.controller.upload);

  app.get("/", {
    schema: {
      tags: ["pdfs"],
      response: { 200: z.array(PdfResponseSchema) },
    },
  }, app.pdfs.controller.list);

  app.delete("/:id", {
    schema: {
      tags: ["pdfs"],
      params: z.object({ id: z.string() }),
    },
  }, app.pdfs.controller.remove);
};
