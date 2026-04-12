import { createMiddleware } from 'hono/factory'
import { verifyToken, JwtPayload } from '../utils/jwt.js'

// Tell Hono what variables are stored in context
type AppVariables = {
  user: JwtPayload
}

// Protect routes that require a logged in user
// Reads the Authorization header, verifies the JWT, attaches user to context
export const authMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized. No token provided.' }, 401)
    }

    const token = authHeader.split(' ')[1]

    try {
      const user = verifyToken(token)
      c.set('user', user)
      await next()
    } catch {
      return c.json({ error: 'Unauthorized. Invalid or expired token.' }, 401)
    }
  }
)