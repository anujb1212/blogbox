import { signinInput, signupInput } from '@anujb_dev/blogbox-common';
import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from "hono";
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';

interface Environment {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}

export const userRouter = new Hono<Environment>();

// Route for creating a new user
userRouter.post('/signup', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();
        const parsed = signupInput.safeParse(body);
        if (!parsed.success) {
            c.status(411);
            return c.json({ message: "Invalid Inputs" });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name,
            },
        });

        const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);

        return c.json({ token });
    } catch (err) {
        console.error("Signup error:", err);
        c.status(500);
        return c.json({ error: "Error while signing up" });
    }
});

// Route for an existing user signing in
userRouter.post('/signin', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();
        const parsed = signinInput.safeParse(body);
        if (!parsed.success) {
            c.status(411);
            return c.json({ message: "Invalid Inputs" });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });

        if (!existingUser) {
            c.status(403);
            return c.json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(body.password, existingUser.password);
        if (!isPasswordValid) {
            c.status(403);
            return c.json({ error: "Invalid email or password" });
        }

        const token = await sign({ id: existingUser.id }, c.env.JWT_SECRET);

        return c.json({ token });
    } catch (err) {
        console.error("Signin error:", err);
        c.status(500);
        return c.json({ error: "Internal Server Error" });
    }
});
