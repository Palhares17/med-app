import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { dbPlugin } from "./plugins/db.plugin";
import { storagePlugin } from "./plugins/storage.plugin";
import { aiPlugin } from "./plugins/ai.plugin";
import { authPlugin } from "./plugins/auth.plugin";
import { usersPlugin } from "./modules/users/users.plugin";
import { usersRoutes } from "./modules/users/users.router";
import { uploadsPlugin } from "./modules/uploads/uploads.plugin";
import { uploadsRoutes } from "./modules/uploads/uploads.router";
import { flashcardsPlugin } from "./modules/flashcards/flashcards.plugin";
import { flashcardsRoutes } from "./modules/flashcards/flashcards.router";

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export async function createServer() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCors, {
    // Vite (5173) e Next.js (3000) em dev.
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Med App API",
        description: "API documentation for Med App",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, { routePrefix: "/docs" });

  await app.register(fastifyMultipart, {
    limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  });

  // infraestrutura compartilhada
  await app.register(dbPlugin);
  await app.register(storagePlugin);
  await app.register(aiPlugin);

  // módulos: primeiro o plugin (injeta os services no app),
  // depois as rotas (consomem app.<modulo>.controller)
  await app.register(usersPlugin);
  await app.register(usersRoutes, { prefix: "/users" });

  // auth depende do users (ensureUser) e decora app.authenticate p/ as rotas.
  await app.register(authPlugin);

  await app.register(uploadsPlugin);
  await app.register(uploadsRoutes, { prefix: "/uploads" });

  await app.register(flashcardsPlugin);
  await app.register(flashcardsRoutes, { prefix: "/flashcards" });

  app.get("/", async () => ({ hello: "world" }));

  return app;
}
