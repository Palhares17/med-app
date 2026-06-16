import fp from "fastify-plugin";
import { ContentRepository } from "./content.repository";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";

declare module "fastify" {
  interface FastifyInstance {
    content: {
      repository: ContentRepository;
      service: ContentService;
      controller: ContentController;
    };
  }
}

export const contentPlugin = fp(
  async (app) => {
    const repository = new ContentRepository(app.db);
    const service = new ContentService(repository);
    const controller = new ContentController(service);
    app.decorate("content", { repository, service, controller });
  },
  { name: "content-plugin", dependencies: ["db-plugin"] }
);
