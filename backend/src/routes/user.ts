import { signinInput, signupInput } from '@anujb_dev/blogbox-common'
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import bcrypt from 'bcryptjs'

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
    }
}>()

userRouter.post('/signup', async (c) => {
    try {
        const body = await c.req.json();
        const parsed = signupInput.safeParse(body);

        if (!parsed.success) {
            return c.json({ error: 'Invalid input', issues: parsed.error.format() }, 400)
        }

        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
        const userExists = await prisma.user.findUnique({
            where: {
                email: parsed.data.email
            }
        })

        if (userExists) {
            return c.json({ error: 'User already exists' }, 409)
        }

        const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: parsed.data.email,
                name: parsed.data.name,
                password: hashedPassword,
            }
        })

        const token = await sign({
            id: user.id,
            email: user.email,
            name: user.name
        }, c.env.JWT_SECRET)

        return c.json({ token })
    } catch (err) {
        console.error('Signup error:', err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
});

userRouter.post('/signin', async (c) => {
    try {
        const body = await c.req.json()
        const parsed = signinInput.safeParse(body)

        if (!parsed.success) {
            return c.json({ error: 'Invalid input', issues: parsed.error.format() }, 400)
        }

        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
        const user = await prisma.user.findUnique({
            where:
                { email: parsed.data.email }
        })

        if (!user) {
            return c.json({ error: 'User not found' }, 404)
        }

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.password)
        if (!passwordMatch) {
            return c.json({ error: 'Incorrect password' }, 401)
        }

        const token = await sign({
            id: user.id,
            email: user.email,
            name: user.name
        }, c.env.JWT_SECRET)

        return c.json({ token })
    } catch (err) {
        console.error('Signin error:', err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
});

export default userRouter