import type { FastifyReply, FastifyRequest } from "fastify";
import type { UsersService } from "./users.service";
import type { CreateUserInput } from "./users.schema";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) => {
    const user = await this.service.create(request.body);
    return reply.status(201).send(user);
  };

  findAll = async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await this.service.findAll();
    return reply.send(users);
  };

  // Called after Supabase Auth login — creates or updates user record
  syncFromAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await this.service.upsert({
      id: request.userId,
      name: request.userName,
      email: request.userEmail,
      avatar: request.userAvatar,
    });
    return reply.send(user);
  };

  getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    const profile = await this.service.getProfile(request.userId);
    if (!profile) return reply.status(404).send({ error: "Usuário não encontrado" });
    return reply.send(profile);
  };
}
