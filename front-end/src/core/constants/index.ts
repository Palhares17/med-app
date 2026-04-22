export const APP_NAME = "MedBrain" as const

/** Application route definitions */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  UPLOAD: "/upload",
  FLASHCARDS: "/flashcards",
  FLASHCARD_STUDY: (id: string) => `/flashcards/${id}` as const,
  QUESTIONS: "/questoes",
  QUESTION_QUIZ: (id: string) => `/questoes/${id}` as const,
  GROUPS: "/grupos",
  GROUP_DETAIL: (id: string) => `/grupos/${id}` as const,
} as const

/** Credit limits per plan */
export const CREDIT_LIMITS = {
  free: 50,
  paid: 500,
} as const

/** Credit cost per generation type */
export const GENERATION_COSTS = {
  flashcards: 8,
  questions: 10,
} as const

/** Upload constraints */
export const UPLOAD_LIMITS = {
  maxFileSizeMB: 20,
  maxPages: 100,
  allowedTypes: ["application/pdf"],
  allowedExtensions: [".pdf"],
} as const

/** Default counts for generation */
export const DEFAULT_GENERATION_COUNT = {
  flashcards: 10,
  questions: 8,
} as const

/** LocalStorage keys */
export const STORAGE_KEYS = {
  USER: "projeto-o:user",
  THEME: "projeto-o:theme",
} as const
