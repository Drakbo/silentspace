import { Hono } from 'hono'
import pool from '../db/connection.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { adminMiddleware } from '../middleware/admin.middleware.js'
import { JwtPayload } from '../utils/jwt.js'

type AppVariables = {
  user: JwtPayload
}

const admin = new Hono<{ Variables: AppVariables }>()

// GET /api/admin/mood-trends
// Returns total mood log count per mood tag for the current week
// Admin only
admin.get('/mood-trends', authMiddleware, adminMiddleware, async (c) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        mood_tag,
        COUNT(*) as total_logs
       FROM mood_logs
       WHERE logged_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY mood_tag
       ORDER BY total_logs DESC`
    ) as any

    // Include mood tags with zero logs so all 5 always appear
    const allTags = ['Happy', 'Calm', 'Anxious', 'Sad', 'Angry']
    const trendsMap: Record<string, number> = {}

    allTags.forEach(tag => { trendsMap[tag] = 0 })
    rows.forEach((row: any) => { trendsMap[row.mood_tag] = Number(row.total_logs) })

    const trends = allTags.map(tag => ({
      mood_tag: tag,
      total_logs: trendsMap[tag]
    }))

    return c.json({ trends })

  } catch (error) {
    console.error('Mood trends error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// GET /api/admin/mood-logs
// Returns all mood logs across all users, anonymized
// User identities are hidden -- only user ID is shown, no names or emails
admin.get('/mood-logs', authMiddleware, adminMiddleware, async (c) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        ml.id,
        CONCAT('User #', LPAD(ml.user_id, 4, '0')) as user_ref,
        ml.mood_tag,
        ml.mood_score,
        ml.logged_at
       FROM mood_logs ml
       ORDER BY ml.logged_at DESC`
    ) as any

    // Total log count for the admin dashboard stat card
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM mood_logs WHERE logged_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)'
    ) as any

    // Most common mood this week
    const [topMood] = await pool.execute(
      `SELECT mood_tag, COUNT(*) as total
       FROM mood_logs
       WHERE logged_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY mood_tag
       ORDER BY total DESC
       LIMIT 1`
    ) as any

    // Total active users this week
    const [activeUsers] = await pool.execute(
      `SELECT COUNT(DISTINCT user_id) as total
       FROM mood_logs
       WHERE logged_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    ) as any

    return c.json({
      mood_logs: rows,
      stats: {
        total_logs_this_week: Number(countResult[0].total),
        most_common_mood: topMood.length > 0 ? topMood[0].mood_tag : null,
        active_users_this_week: Number(activeUsers[0].total)
      }
    })

  } catch (error) {
    console.error('Admin mood logs error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

export default admin