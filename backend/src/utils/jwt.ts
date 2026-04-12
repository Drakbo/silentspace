import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Shape of data stored inside the JWT token
export interface JwtPayload {
  id: number
  email: string
  user_type_id: number
  type_name: string
}

// Create a JWT token for a user after login or register
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '7d'
  })
}

// Verify and decode a JWT token from a request header
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload
}