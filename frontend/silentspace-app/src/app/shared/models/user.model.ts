export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  user_type_id: number
  type_name?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}