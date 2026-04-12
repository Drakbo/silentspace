import { Hono } from 'hono'
import pool from '../db/connection.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { JwtPayload } from '../utils/jwt.js'

type AppVariables = {
  user: JwtPayload
}

const copingTips = new Hono<{ Variables: AppVariables }>()

// GET /api/coping-tips/:moodTag
// Returns one random coping tip matching the mood tag
// Requires authentication
copingTips.get('/:moodTag', authMiddleware, async (c) => {
  try {
    const moodTag = c.req.param('moodTag')

    const validTags = ['Happy', 'Calm', 'Anxious', 'Sad', 'Angry']
    if (!validTags.includes(moodTag)) {
      return c.json({ error: 'Invalid mood tag.' }, 400)
    }

    const [tips] = await pool.execute(
      'SELECT id, tip_text FROM coping_tips WHERE mood_tag = ? ORDER BY RAND() LIMIT 1',
      [moodTag]
    ) as any

    if (tips.length === 0) {
      return c.json({ error: 'No coping tip found for this mood tag.' }, 404)
    }

    return c.json({
      mood_tag: moodTag,
      tip: tips[0]
    })

  } catch (error) {
    console.error('Coping tip error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

export default copingTips