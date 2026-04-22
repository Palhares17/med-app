export interface StudyProgress {
  currentIndex: number
  total: number
  known: number
  unknown: number
}

export interface StudyResult {
  total: number
  known: number
  unknown: number
  percentage: number
}
