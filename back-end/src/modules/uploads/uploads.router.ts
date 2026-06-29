import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  UploadResponseSchema,
  UploadDetailSchema,
  UploadParamsSchema,
} from "./uploads.schema";

export const uploadsRoutes: FastifyPluginAsyncZod = async (app) => {
  // Todas as rotas de uploads exigem usuário autenticado.
  app.addHook("preHandler", app.authenticate);

  app.post(
    "/",
    {
      schema: {
        tags: ["uploads"],
        summary: "Envia um PDF e cria um registro de upload",
        consumes: ["multipart/form-data"],
        response: { 201: UploadResponseSchema },
      },
    },
    app.uploads.controller.create,
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["uploads"],
        summary: "Lista todos os uploads",
        response: { 200: z.array(UploadResponseSchema) },
      },
    },
    app.uploads.controller.findAll,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["uploads"],
        summary: "Detalha um upload com URL de download assinada",
        params: UploadParamsSchema,
        response: { 200: UploadDetailSchema },
      },
    },
    app.uploads.controller.findOne,
  );
};
