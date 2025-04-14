import { Hono } from 'hono';
import { PrismaClient } from './generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';

interface Environment {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}

const app = new Hono<Environment>();

app.use('api/v1/blog/*', async (c, next) => {
  const authHeader = c.req.header("Authorization") || ""

  const token = authHeader.split(' ')[1]

  const payload = await verify(authHeader, c.env.JWT_SECRET)

  if (payload.id) {
    next()
  } else {
    c.status(403)
    return c.json({ error: "Unauthorized" })
  }
})

app.post('/api/v1/user/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)

    return c.json({
      jwt: token
    })
  } catch (err) {
    console.error("Signup error:", err)
    c.status(500)
    return c.json({
      error: "Error while signing up"
    })
  }
})

app.post('/api/v1/signin', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!user) {
      c.status(403)
      return c.json({ error: "User not found" })
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt })

  } catch (err) {
    console.error("Signin error:", err)
    c.status(500)
    return c.json({ error: "Internal Server Error" })
  }
})

app.post('/api/v1/blog', (c) => {
  return c.text('')
})

app.put('', (c) => {
  return c.text('')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('')
})

export default app
