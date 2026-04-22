import type { User } from "@/core/entities/user.entity"

export const mockUser: User = {
  id: "usr_01HQXG7K3M2N4P5R6S8T9VWXYZ",
  name: "Matheus Silva",
  email: "matheus.silva@email.com",
  avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Matheus+Silva&backgroundColor=3b82f6&textColor=ffffff",
  plan: "free",
  credits: {
    used: 35,
    total: 50,
  },
  createdAt: "2025-08-15T10:30:00Z",
}
