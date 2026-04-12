import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import 'dotenv/config'
import auth from './routes/auth.js'
import moodLogs from './routes/mood-logs.js'
import copingTips from './routes/coping-tips.js'
import resources from './routes/resources.js'
import admin from './routes/admin.js'

const app = new Hono()

app.use('/*', cors({
  origin: 'http://localhost:4200',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => {
  return c.json({ message: 'SilentSpace API is running.' })
})

app.route('/api/auth', auth)
app.route('/api/mood-logs', moodLogs)
app.route('/api/coping-tips', copingTips)
app.route('/api/resources', resources)
app.route('/api/admin', admin)

const port = Number(process.env.PORT) || 3000

serve({ fetch: app.fetch, port }, () => {
  console.log(`SilentSpace API running on http://localhost:${port}`)
})

export default app