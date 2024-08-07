import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator'


const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  description: z.string(),
  color: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).default("pending"),
  project_manager: z.string(),
  project_member: z.string().optional(),
  todos: z.array(z.object({
    title: z.string(),
    content: z.string(),
    status: z.enum(["pending", "done"]).default("pending"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    tags: z.array(z.string()).optional(),
    due_date: z.string().optional(),
  })).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

const createProjectSchema = projectSchema.omit({ id: true })

type Project = z.infer<typeof projectSchema>

const projectRoute = new Hono()

projectRoute
  .get('/', async (c) => {
    return c.json({
      message: "welcome to my app"
    })
  })
  .post('/',
    zValidator("json", createProjectSchema),
    async (c) => {
      const body = c.req.valid('json')

      c.status(201)
      return c.json({
        message: "Project created",
        data: body
      })
    })
  .get('/:id', async (c) => {
      const id = c.req.param('id')
      return c.json({
        message: "Project found",
        data: id
      })
    })

export default projectRoute