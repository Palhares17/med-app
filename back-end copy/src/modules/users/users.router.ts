import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CreateUserSchema, UserResponseSchema } from "./users.schema";

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "Cria um novo usuário",
        body: CreateUserSchema,
        response: { 201: UserResponseSchema },
      },
    },
    app.users.controller.create,
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "Lista todos os usuários",
        response: { 200: z.array(UserResponseSchema) },
      },
    },
    app.users.controller.findAll,
  );
};
