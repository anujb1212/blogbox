import { createBlog, updateBlog } from '@anujb_dev/blogbox-common';
import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from "hono";
import { verify } from 'hono/jwt';

interface Environment {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}

export const blogRouter = new Hono<Environment>();

// Route to fetch all blog posts (public - no auth needed)
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const allBlogPosts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return c.json({ allBlogPosts });

    } catch (err) {
        console.error(err);
        return c.json({ message: "Error while fetching all the blog posts" }, 500);
    }
});

// Route to fetch a specific blog post (public - no auth needed)
blogRouter.get('/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const id = c.req.param("id");

        const existingBlogPost = await prisma.post.findFirst({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });

        if (!existingBlogPost) {
            return c.json({ message: "Blog post not found" }, 404);
        }

        return c.json({ existingBlogPost });

    } catch (err) {
        console.error(err);
        return c.json({ message: "Error while fetching the blog post" }, 500);
    }
});

// Middleware to verify JWT and set userId (for protected routes)
blogRouter.use('/*', async (c, next) => {
    try {
        const authHeader = c.req.header("Authorization") || "";
        if (!authHeader.startsWith("Bearer ")) {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const token = authHeader.split(" ")[1];
        const user = await verify(token, c.env.JWT_SECRET);

        if (user && typeof user.id === "string") {
            c.set("userId", user.id);
            await next();
        } else {
            return c.json({ error: "Unauthorized" }, 403);
        }

    } catch (err) {
        console.error(err);
        return c.json({ error: "Unauthorized" }, 403);
    }
});

// Route to create a new blog post (protected)
blogRouter.post('/', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();
        const parsed = createBlog.safeParse(body);

        if (!parsed.success) {
            return c.json({ message: "Invalid Inputs", errors: parsed.error.errors }, 411);
        }

        const authorId = c.get("userId");

        const newBlogPost = await prisma.post.create({
            data: {
                title: parsed.data.title,
                content: parsed.data.content,
                authorId: authorId,
            },
        });

        return c.json({
            id: newBlogPost.id,
            title: newBlogPost.title,
            createdAt: newBlogPost.createdAt,
        });

    } catch (err) {
        console.error("Post Error:", err);
        return c.json({ message: "Post not created" }, 500);
    }
});

// Route to update a blog post (protected - only by actual author)
blogRouter.put('/', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();
        const parsed = updateBlog.safeParse(body);

        if (!parsed.success) {
            return c.json({ message: "Invalid Inputs", errors: parsed.error.errors }, 411);
        }

        const userId = c.get("userId");

        const existingPost = await prisma.post.findFirst({
            where: {
                id: parsed.data.id,
                authorId: userId
            }
        });

        if (!existingPost) {
            return c.json({ message: "Unauthorized or blog not found" }, 403);
        }

        const updatedPost = await prisma.post.update({
            where: { id: parsed.data.id },
            data: {
                title: parsed.data.title,
                content: parsed.data.content,
            }
        });

        return c.json({ id: updatedPost.id });

    } catch (err) {
        console.error(err);
        return c.json({ message: "Post did not update" }, 500);
    }
});

// Route to delete a blog post (protected - only by actual author)
blogRouter.delete('/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blogId = c.req.param("id");
        const userId = c.get("userId");

        const existingPost = await prisma.post.findFirst({
            where: {
                id: blogId,
                authorId: userId
            }
        });

        if (!existingPost) {
            return c.json({ message: "Unauthorized or Blog not found" }, 403);
        }

        await prisma.post.delete({
            where: { id: blogId }
        });

        return c.json({ message: "Blog deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        return c.json({ message: "Failed to delete post" }, 500);
    }
});