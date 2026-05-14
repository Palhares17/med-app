import fp from "fastify-plugin";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

declare module "fastify" {
  interface FastifyInstance {
    users: {
      repository: UsersRepository;
      service: UsersService;
      controller: UsersController;
    };
  }
}

export const usersPlugin = fp(
  async (app) => {
    const repository = new UsersRepository(app.db);
    const service = new UsersService(repository);
    const controller = new UsersController(service);

    app.decorate("users", { repository, service, controller });
  },
  { name: "users-plugin", dependencies: ["db-plugin"] },
);
