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

export async function createServer() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCors, {
    origin: "http://localhost:5173",
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

  // infraestrutura compartilhada
  await app.register(dbPlugin);

  // módulos: primeiro o plugin (injeta os services no app),
  // depois as rotas (consomem app.users.controller)
  await app.register(usersPlugin);
  await app.register(usersRoutes, { prefix: "/users" });

  app.get("/", async () => ({ hello: "world" }));

  return app;
}
