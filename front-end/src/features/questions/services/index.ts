import { apiGet, apiPost } from "@/core/lib/api"
import type { QuestionSet } from "@/core/entities/question.entity"

export interface ApiQuestionSet {
  id: string
  topicId: string
  userId: string
  createdAt: string
  topic: { id: string; topic: string; subject: string }
  questions: Array<{
    id: string
    question: string
    alternatives: Array<{ id: string; text: string; isCorrect: boolean }>
    explanation: string
  }>
}

function toQuestionSet(qs: ApiQuestionSet): QuestionSet {
  return {
    id: qs.id,
    topic: qs.topic?.topic ?? "Sem tópico",
    subject: qs.topic?.subject ?? "Geral",
    questionCount: qs.questions?.length ?? 0,
    createdAt: qs.createdAt,
    questions: qs.questions ?? [],
  }
}

export async function listQuestionSets(): Promise<QuestionSet[]> {
  const data = await apiGet<ApiQuestionSet[]>("/content/questions")
  return data.map(toQuestionSet)
}

export async function getQuestionSet(id: string): Promise<QuestionSet> {
  const data = await apiGet<ApiQuestionSet>(`/content/questions/${id}`)
  return toQuestionSet(data)
}

export async function generateQuestions(payload: {
  pdfText: string
  topic: string
  subject?: string
  pdfId?: string
}): Promise<{ questionSet: { id: string }; questions: unknown[] }> {
  return apiPost("/content/questions/generate", payload)
}

export async function submitAnswer(payload: {
  questionId: string
  selectedAlternativeId: string
  groupId?: string
}) {
  return apiPost<{ isCorrect: boolean; pointsEarned: number; correctAlternativeId: string }>(
    "/scoring/answers",
    payload
  )
}
