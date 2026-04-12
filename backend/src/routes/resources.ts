import { Hono } from 'hono'
import pool from '../db/connection.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { adminMiddleware } from '../middleware/admin.middleware.js'
import { JwtPayload } from '../utils/jwt.js'

type AppVariables = {
  user: JwtPayload
}

const resources = new Hono<{ Variables: AppVariables }>()

// GET /api/resources
// Returns all resources, publicly accessible without login
// Optional query param: ?type=Counselor
resources.get('/', async (c) => {
  try {
    const type = c.req.query('type')

    let query = 'SELECT id, name, type, address, contact, description FROM resources'
    const params: string[] = []

    if (type) {
      query += ' WHERE type = ?'
      params.push(type)
    }

    query += ' ORDER BY name ASC'

    const [rows] = await pool.execute(query, params) as any

    return c.json({ resources: rows })

  } catch (error) {
    console.error('Get resources error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// POST /api/resources
// Admin adds a new resource listing
resources.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { name, type, address, contact, description } = await c.req.json()

    if (!name || !type || !address || !contact) {
      return c.json({ error: 'Name, type, address, and contact are required.' }, 400)
    }

    const [result] = await pool.execute(
      'INSERT INTO resources (name, type, address, contact, description) VALUES (?, ?, ?, ?, ?)',
      [name, type, address, contact, description || null]
    ) as any

    return c.json({
      message: 'Resource added successfully.',
      resource: {
        id: result.insertId,
        name,
        type,
        address,
        contact,
        description: description || null
      }
    }, 201)

  } catch (error) {
    console.error('Add resource error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// PUT /api/resources/:id
// Admin edits an existing resource listing
resources.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id')
    const { name, type, address, contact, description } = await c.req.json()

    if (!name || !type || !address || !contact) {
      return c.json({ error: 'Name, type, address, and contact are required.' }, 400)
    }

    const [existing] = await pool.execute(
      'SELECT id FROM resources WHERE id = ?',
      [id]
    ) as any

    if (existing.length === 0) {
      return c.json({ error: 'Resource not found.' }, 404)
    }

    await pool.execute(
      'UPDATE resources SET name = ?, type = ?, address = ?, contact = ?, description = ? WHERE id = ?',
      [name, type, address, contact, description || null, id]
    )

    return c.json({ message: 'Resource updated successfully.' })

  } catch (error) {
    console.error('Update resource error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// DELETE /api/resources/:id
// Admin deletes a resource listing
resources.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id')

    const [existing] = await pool.execute(
      'SELECT id FROM resources WHERE id = ?',
      [id]
    ) as any

    if (existing.length === 0) {
      return c.json({ error: 'Resource not found.' }, 404)
    }

    await pool.execute('DELETE FROM resources WHERE id = ?', [id])

    return c.json({ message: 'Resource deleted successfully.' })

  } catch (error) {
    console.error('Delete resource error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

export default resources