export interface QuizState {
  currentIndex: number
  answers: Record<string, string>
  showFeedback: boolean
  selectedAnswer: string | null
}

export interface QuizResult {
  total: number
  correct: number
  incorrect: number
  percentage: number
  answers: Array<{
    questionId: string
    selectedId: string
    correctId: string
    isCorrect: boolean
  }>
}
