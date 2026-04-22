export interface LoginFormData {
  email: string
  password: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
