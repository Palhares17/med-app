export interface CreditInfo {
  used: number
  total: number
  plan: "free" | "paid"
  resetDate: string
}
