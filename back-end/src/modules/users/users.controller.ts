import type { FastifyReply, FastifyRequest } from "fastify";
import type { UsersService } from "./users.service";
import type { CreateUserInput } from "./users.schema";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply,
  ) => {
    const user = await this.service.create(request.body);
    return reply.status(201).send(user);
  };

  findAll = async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await this.service.findAll();
    return reply.send(users);
  };
}
