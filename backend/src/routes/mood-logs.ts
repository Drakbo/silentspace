import { Hono } from 'hono'
import pool from '../db/connection.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { JwtPayload } from '../utils/jwt.js'

const moodLogs = new Hono()

// Mood tag to score mapping (Option A -- auto-assigned by backend)
const moodScores: Record<string, number> = {
  Happy: 5,
  Calm: 4,
  Anxious: 3,
  Sad: 2,
  Angry: 1
}

// POST /api/mood-logs
// Authenticated user submits a mood tag
// Backend auto-assigns mood score and fetches a random coping tip
moodLogs.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload
    const { mood_tag } = await c.req.json()

    // Validate mood tag
    const validTags = ['Happy', 'Calm', 'Anxious', 'Sad', 'Angry']
    if (!mood_tag || !validTags.includes(mood_tag)) {
      return c.json({ error: 'Invalid mood tag. Must be Happy, Calm, Anxious, Sad, or Angry.' }, 400)
    }

    // Check if user already logged a mood today
    const [existing] = await pool.execute(
      'SELECT id FROM mood_logs WHERE user_id = ? AND DATE(logged_at) = CURDATE()',
      [user.id]
    ) as any

    if (existing.length > 0) {
      return c.json({ error: 'You have already logged your mood today.' }, 409)
    }

    // Auto-assign mood score from mood tag
    const mood_score = moodScores[mood_tag]

    // Get a random coping tip matching the mood tag
    const [tips] = await pool.execute(
      'SELECT id, tip_text FROM coping_tips WHERE mood_tag = ? ORDER BY RAND() LIMIT 1',
      [mood_tag]
    ) as any

    if (tips.length === 0) {
      return c.json({ error: 'No coping tip found for this mood tag.' }, 404)
    }

    const tip = tips[0]

    // Insert mood log into database
    const [result] = await pool.execute(
      'INSERT INTO mood_logs (user_id, mood_score, mood_tag, tip_shown) VALUES (?, ?, ?, ?)',
      [user.id, mood_score, mood_tag, tip.id]
    ) as any

    return c.json({
      message: 'Mood logged successfully.',
      mood_log: {
        id: result.insertId,
        mood_tag,
        mood_score,
        logged_at: new Date().toISOString()
      },
      coping_tip: {
        id: tip.id,
        tip_text: tip.tip_text
      }
    }, 201)

  } catch (error) {
    console.error('Mood log error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// GET /api/mood-logs
// Returns all mood logs for the authenticated user
moodLogs.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload

    const [rows] = await pool.execute(
      `SELECT id, mood_tag, mood_score, logged_at
       FROM mood_logs
       WHERE user_id = ?
       ORDER BY logged_at DESC`,
      [user.id]
    ) as any

    return c.json({ mood_logs: rows })

  } catch (error) {
    console.error('Get mood logs error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// GET /api/mood-logs/weekly
// Returns the authenticated user's mood logs for the past 7 days
moodLogs.get('/weekly', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload

    const [rows] = await pool.execute(
      `SELECT id, mood_tag, mood_score, logged_at
       FROM mood_logs
       WHERE user_id = ?
       AND logged_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       ORDER BY logged_at ASC`,
      [user.id]
    ) as any

    return c.json({ mood_logs: rows })

  } catch (error) {
    console.error('Weekly mood logs error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

export default moodLogs