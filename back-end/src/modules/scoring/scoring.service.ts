import type { ScoringRepository } from "./scoring.repository";
import type { ContentRepository } from "../content/content.repository";

const POINTS_PER_CORRECT = 10;

export class ScoringService {
  constructor(
    private readonly repo: ScoringRepository,
    private readonly contentRepo: ContentRepository
  ) {}

  async submitAnswer(
    userId: string,
    questionId: string,
    selectedAlternativeId: string,
    groupId?: string | null
  ) {
    const question = await this.contentRepo.getQuestionById(questionId);
    if (!question) throw new Error("Questão não encontrada");

    const alts = question.alternatives as Array<{ id: string; isCorrect: boolean }>;
    const correct = alts.find((a) => a.isCorrect);
    const isCorrect = correct?.id === selectedAlternativeId;
    const pointsEarned = isCorrect ? POINTS_PER_CORRECT : 0;

    const answer = await this.repo.recordAnswer({
      userId,
      questionId,
      groupId,
      selectedAlternativeId,
      isCorrect,
      pointsEarned,
    });

    return { ...answer, correctAlternativeId: correct?.id };
  }

  async getUserHistory(userId: string) {
    return this.repo.getUserHistory(userId);
  }
}
