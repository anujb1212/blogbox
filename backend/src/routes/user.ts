import { signinInput, signupInput } from '@anujb_dev/blogbox-common';
import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from "hono";
import { sign } from 'hono/jwt';

interface Environment {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
    }
}

export const userRouter = new Hono<Environment>();

//Route for creating a new user
userRouter.post('/signup', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const body = await c.req.json();
        const { success } = signupInput.safeParse(body)
        if (!success) {
            c.status(411)
            return c.json({
                message: "Invalid Inputs"
            })
        }

        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        })
        const token = await sign({ id: newUser.id }, c.env.JWT_SECRET)

        return c.json({
            jwt: token
        })
    } catch (err) {
        console.error("Signup error:", err)
        c.status(500)
        return c.json({ error: "Error while signing up" })
    }

})

//Route for an existing user signing in
userRouter.post('/signin', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate())

        const body = await c.req.json()
        const { success } = signinInput.safeParse(body)
        if (!success) {
            c.status(411)
            return c.json({
                message: "Invalid Inputs"
            })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password
            }
        })

        if (!existingUser) {
            c.status(403)
            return c.json({ error: "User not found" })
        }

        const jwt = await sign({ id: existingUser.id }, c.env.JWT_SECRET)
        return c.json({ jwt })

    } catch (err) {
        console.error("Signin error:", err)
        c.status(500)
        return c.json({ error: "Internal Server Error" })
    }
})
