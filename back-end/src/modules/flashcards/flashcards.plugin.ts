import fp from "fastify-plugin";
import { FlashcardsController } from "./flashcards.controller";
import { FlashcardsRepository } from "./flashcards.repository";
import { FlashcardsService } from "./flashcards.service";

declare module "fastify" {
  interface FastifyInstance {
    flashcards: {
      repository: FlashcardsRepository;
      service: FlashcardsService;
      controller: FlashcardsController;
    };
  }
}

export const flashcardsPlugin = fp(
  async (app) => {
    const repository = new FlashcardsRepository(app.db);
    const service = new FlashcardsService(
      repository,
      app.uploads.service,
      app.storage,
      app.ai,
    );
    const controller = new FlashcardsController(service);

    app.decorate("flashcards", { repository, service, controller });
  },
  {
    name: "flashcards-plugin",
    dependencies: ["db-plugin", "storage-plugin", "ai-plugin", "uploads-plugin"],
  },
);
