import fp from "fastify-plugin";
import { GroupsRepository } from "./groups.repository";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";

declare module "fastify" {
  interface FastifyInstance {
    groups: {
      repository: GroupsRepository;
      service: GroupsService;
      controller: GroupsController;
    };
  }
}

export const groupsPlugin = fp(
  async (app) => {
    const repository = new GroupsRepository(app.db);
    const service = new GroupsService(repository);
    const controller = new GroupsController(service);
    app.decorate("groups", { repository, service, controller });
  },
  { name: "groups-plugin", dependencies: ["db-plugin"] }
);
