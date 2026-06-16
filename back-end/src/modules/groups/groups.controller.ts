import type { FastifyReply, FastifyRequest } from "fastify";
import type { GroupsService } from "./groups.service";

export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  create = async (
    request: FastifyRequest<{ Body: { name: string; description: string } }>,
    reply: FastifyReply
  ) => {
    const group = await this.service.create(request.userId, request.body);
    return reply.status(201).send(group);
  };

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const groups = await this.service.listByUser(request.userId);
    return reply.send(groups);
  };

  getDetail = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const group = await this.service.getDetail(request.params.id, request.userId);
      return reply.send(group);
    } catch (e: any) {
      if (e.message === "Sem permissão") return reply.status(403).send({ error: e.message });
      if (e.message === "Grupo não encontrado") return reply.status(404).send({ error: e.message });
      throw e;
    }
  };

  joinByCode = async (
    request: FastifyRequest<{ Params: { code: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const group = await this.service.joinByCode(request.userId, request.params.code);
      return reply.send(group);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  };

  removeMember = async (
    request: FastifyRequest<{ Params: { id: string; memberId: string } }>,
    reply: FastifyReply
  ) => {
    await this.service.removeMember(request.userId, request.params.id, request.params.memberId);
    return reply.status(204).send();
  };

  deleteGroup = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    await this.service.deleteGroup(request.userId, request.params.id);
    return reply.status(204).send();
  };

  getRanking = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const ranking = await this.service.getRanking(request.params.id, request.userId);
    return reply.send(ranking);
  };
}
