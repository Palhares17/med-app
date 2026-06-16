import fp from "fastify-plugin";
import { PdfsRepository } from "./pdfs.repository";
import { PdfsService } from "./pdfs.service";
import { PdfsController } from "./pdfs.controller";

declare module "fastify" {
  interface FastifyInstance {
    pdfs: {
      repository: PdfsRepository;
      service: PdfsService;
      controller: PdfsController;
    };
  }
}

export const pdfsPlugin = fp(
  async (app) => {
    const repository = new PdfsRepository(app.db);
    const service = new PdfsService(repository);
    const controller = new PdfsController(service);
    app.decorate("pdfs", { repository, service, controller });
  },
  { name: "pdfs-plugin", dependencies: ["db-plugin"] }
);
