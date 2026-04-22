"use client"

import { use } from "react"
import { QuestionQuizPage } from "@/features/questions/views/question-quiz.page"

export default function QuestionQuiz({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <QuestionQuizPage setId={id} />
}
