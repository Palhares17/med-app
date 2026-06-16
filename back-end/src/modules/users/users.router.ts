import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CreateUserSchema, UserResponseSchema } from "./users.schema";
import { authMiddleware } from "../../core/middlewares/auth.middleware";

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  // Public route (kept for backwards compat)
  app.post("/", {
    schema: {
      tags: ["users"],
      summary: "Cria um novo usuário",
      body: CreateUserSchema,
      response: { 201: UserResponseSchema },
    },
  }, app.users.controller.create);

  app.get("/", {
    schema: {
      tags: ["users"],
      summary: "Lista todos os usuários",
      response: { 200: z.array(UserResponseSchema) },
    },
  }, app.users.controller.findAll);

  // Authenticated routes
  app.post("/sync", {
    preHandler: authMiddleware,
    schema: { tags: ["users"], summary: "Sincroniza usuário após login Supabase" },
  }, app.users.controller.syncFromAuth);

  app.get("/me", {
    preHandler: authMiddleware,
    schema: { tags: ["users"], summary: "Perfil do usuário autenticado" },
  }, app.users.controller.getProfile);
};
