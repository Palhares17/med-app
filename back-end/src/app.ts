import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { dbPlugin } from "./plugins/db.plugin";

import { usersPlugin } from "./modules/users/users.plugin";
import { usersRoutes } from "./modules/users/users.router";

import { pdfsPlugin } from "./modules/pdfs/pdfs.plugin";
import { pdfsRoutes } from "./modules/pdfs/pdfs.router";

import { contentPlugin } from "./modules/content/content.plugin";
import { contentRoutes } from "./modules/content/content.router";

import { scoringPlugin } from "./modules/scoring/scoring.plugin";
import { scoringRoutes } from "./modules/scoring/scoring.router";

import { groupsPlugin } from "./modules/groups/groups.plugin";
import { groupsRoutes } from "./modules/groups/groups.router";

export async function createServer() {
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCors, {
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "MedBrain API",
        description: "API do MedBrain — plataforma de estudos com IA",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, { routePrefix: "/docs" });

  // Infraestrutura
  await app.register(dbPlugin);

  // Módulos
  await app.register(usersPlugin);
  await app.register(usersRoutes, { prefix: "/users" });

  await app.register(pdfsPlugin);
  await app.register(pdfsRoutes, { prefix: "/pdfs" });

  await app.register(contentPlugin);
  await app.register(contentRoutes, { prefix: "/content" });

  await app.register(scoringPlugin);
  await app.register(scoringRoutes, { prefix: "/scoring" });

  await app.register(groupsPlugin);
  await app.register(groupsRoutes, { prefix: "/groups" });

  app.get("/", async () => ({ status: "ok", version: "1.0.0" }));
  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
