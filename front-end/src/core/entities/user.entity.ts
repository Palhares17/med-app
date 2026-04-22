export interface User {
  id: string
  name: string
  email: string
  avatar: string
  plan: "free" | "paid"
  credits: {
    used: number
    total: number
  }
  createdAt: string
}
