import dotenv from 'dotenv'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { clerkMiddleware } from '@hono/clerk-auth'
import projectRoute from './routes/project'


/*
=========================================================
MARK: APP
=========================================================
*/ 
dotenv.config()

const app = new Hono().basePath('/api')

app.use(logger())
app.use('*', clerkMiddleware())
app.route('/', projectRoute)

const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port: port as number
})