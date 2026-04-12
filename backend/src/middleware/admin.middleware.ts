import { createMiddleware } from 'hono/factory'
import { JwtPayload } from '../utils/jwt.js'

type AppVariables = {
  user: JwtPayload
}

// Protect routes that require admin access
// Must be used AFTER authMiddleware
export const adminMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const user = c.get('user')

    if (!user || user.user_type_id !== 2) {
      return c.json({ error: 'Forbidden. Admin access required.' }, 403)
    }

    await next()
  }
)