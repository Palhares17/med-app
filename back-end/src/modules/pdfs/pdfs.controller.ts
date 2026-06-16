import type { FastifyReply, FastifyRequest } from "fastify";
import type { PdfsService } from "./pdfs.service";
import type { UploadPdfInput } from "./pdfs.schema";

export class PdfsController {
  constructor(private readonly service: PdfsService) {}

  upload = async (
    request: FastifyRequest<{ Body: UploadPdfInput }>,
    reply: FastifyReply
  ) => {
    const { filename, originalName, sizeBytes, groupId } = request.body;
    const pdf = await this.service.upload(request.userId, {
      filename,
      originalName,
      sizeBytes,
      groupId,
    });
    return reply.status(201).send(pdf);
  };

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const pdfs = await this.service.list(request.userId);
    return reply.send(pdfs);
  };

  remove = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    await this.service.remove(request.params.id, request.userId);
    return reply.status(204).send();
  };
}
