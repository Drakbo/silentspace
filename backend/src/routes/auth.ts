import { Hono } from 'hono'
import pool from '../db/connection.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { signToken } from '../utils/jwt.js'

const auth = new Hono()

// POST /api/auth/register
// Registers a new user with first_name, last_name, email, password
// Assigns user_type_id = 1 (user) by default
auth.post('/register', async (c) => {
  try {
    const { first_name, last_name, email, password } = await c.req.json()

    // Validate all fields are present
    if (!first_name || !last_name || !email || !password) {
      return c.json({ error: 'All fields are required.' }, 400)
    }

    // Check if email already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any

    if (existing.length > 0) {
      return c.json({ error: 'Email is already registered.' }, 409)
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password)

    // Insert new user with default user_type_id = 1
    const [result] = await pool.execute(
      `INSERT INTO users
        (first_name, last_name, email, password, user_type_id)
       VALUES (?, ?, ?, ?, 1)`,
      [first_name, last_name, email, hashedPassword]
    ) as any

    const userId = result.insertId

    // Get user type name to include in JWT
    const [userType] = await pool.execute(
      'SELECT type_name FROM user_types WHERE id = 1'
    ) as any

    // Create JWT token
    const token = signToken({
      id: userId,
      email,
      user_type_id: 1,
      type_name: userType[0].type_name
    })

    return c.json({
      message: 'Registration successful.',
      token,
      user: {
        id: userId,
        first_name,
        last_name,
        email,
        user_type_id: 1
      }
    }, 201)

  } catch (error) {
    console.error('Register error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// POST /api/auth/login
// Logs in a user with email and password, returns JWT
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required.' }, 400)
    }

    // Find user by email, join with user_types to get type_name
    const [rows] = await pool.execute(
      `SELECT
        u.id, u.first_name, u.last_name, u.email,
        u.password, u.user_type_id, ut.type_name
       FROM users u
       JOIN user_types ut ON u.user_type_id = ut.id
       WHERE u.email = ?`,
      [email]
    ) as any

    if (rows.length === 0) {
      return c.json({ error: 'Invalid email or password.' }, 401)
    }

    const user = rows[0]

    // Compare submitted password against stored hash
    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
      return c.json({ error: 'Invalid email or password.' }, 401)
    }

    // Create JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      user_type_id: user.user_type_id,
      type_name: user.type_name
    })

    return c.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type_id: user.user_type_id,
        type_name: user.type_name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})

// POST /api/auth/logout
// Client discards the JWT. Server just confirms.
auth.post('/logout', (c) => {
  return c.json({ message: 'Logged out successfully.' })
})

export default auth