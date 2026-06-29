import fp from "fastify-plugin";
import { UploadsController } from "./uploads.controller";
import { UploadsRepository } from "./uploads.repository";
import { UploadsService } from "./uploads.service";

declare module "fastify" {
  interface FastifyInstance {
    uploads: {
      repository: UploadsRepository;
      service: UploadsService;
      controller: UploadsController;
    };
  }
}

export const uploadsPlugin = fp(
  async (app) => {
    const repository = new UploadsRepository(app.db);
    const service = new UploadsService(repository, app.storage);
    const controller = new UploadsController(service);

    app.decorate("uploads", { repository, service, controller });
  },
  { name: "uploads-plugin", dependencies: ["db-plugin", "storage-plugin"] },
);
