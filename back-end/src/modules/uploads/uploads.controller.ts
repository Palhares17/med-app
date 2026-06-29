import type { FastifyReply, FastifyRequest } from "fastify";
import { UploadError, type UploadsService } from "./uploads.service";

export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ message: "Nenhum arquivo enviado." });
    }

    let buffer: Buffer;
    try {
      buffer = await file.toBuffer();
    } catch (err) {
      if ((err as { code?: string }).code === "FST_REQ_FILE_TOO_LARGE") {
        return reply
          .status(413)
          .send({ message: "O arquivo excede o limite de 20 MB." });
      }
      throw err;
    }

    try {
      const upload = await this.service.upload({
        fileName: file.filename,
        mimeType: file.mimetype,
        buffer,
        userId: request.user!.id,
      });
      return reply.status(201).send(upload);
    } catch (err) {
      if (err instanceof UploadError) {
        return reply.status(err.statusCode).send({ message: err.message });
      }
      throw err;
    }
  };

  findAll = async (request: FastifyRequest, reply: FastifyReply) => {
    const uploads = await this.service.findAll(request.user!.id);
    return reply.send(uploads);
  };

  findOne = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    try {
      const { upload, downloadUrl } = await this.service.findById(
        request.params.id,
        request.user!.id,
      );
      return reply.send({ ...upload, downloadUrl });
    } catch (err) {
      if (err instanceof UploadError) {
        return reply.status(err.statusCode).send({ message: err.message });
      }
      throw err;
    }
  };
}
