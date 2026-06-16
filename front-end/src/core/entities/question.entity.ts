export interface Alternative {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  question: string
  alternatives: Alternative[]
  explanation: string
}

export interface QuestionSet {
  id: string
  topic: string
  subject: string
  questionCount: number
  createdAt: string
  questions: Question[]
}
