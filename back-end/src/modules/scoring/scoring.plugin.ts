import fp from "fastify-plugin";
import { ScoringRepository } from "./scoring.repository";
import { ScoringService } from "./scoring.service";
import { ScoringController } from "./scoring.controller";

declare module "fastify" {
  interface FastifyInstance {
    scoring: {
      repository: ScoringRepository;
      service: ScoringService;
      controller: ScoringController;
    };
  }
}

export const scoringPlugin = fp(
  async (app) => {
    const repository = new ScoringRepository(app.db);
    const service = new ScoringService(repository, app.content.repository);
    const controller = new ScoringController(service);
    app.decorate("scoring", { repository, service, controller });
  },
  { name: "scoring-plugin", dependencies: ["db-plugin", "content-plugin"] }
);
