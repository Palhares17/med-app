import type { FastifyReply, FastifyRequest } from "fastify";
import type { ScoringService } from "./scoring.service";

interface SubmitBody {
  questionId: string;
  selectedAlternativeId: string;
  groupId?: string;
}

export class ScoringController {
  constructor(private readonly service: ScoringService) {}

  submit = async (
    request: FastifyRequest<{ Body: SubmitBody }>,
    reply: FastifyReply
  ) => {
    const { questionId, selectedAlternativeId, groupId } = request.body;
    const result = await this.service.submitAnswer(
      request.userId,
      questionId,
      selectedAlternativeId,
      groupId
    );
    return reply.status(201).send(result);
  };

  history = async (request: FastifyRequest, reply: FastifyReply) => {
    const h = await this.service.getUserHistory(request.userId);
    return reply.send(h);
  };
}
