import { createBlog, updateBlog } from '@anujb_dev/blogbox-common';
import { PrismaClient } from '../generated/prisma/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from "hono";
import { verify } from 'hono/jwt';

interface Environment {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}

export const blogRouter = new Hono<Environment>();

//Route for fetching all the blogs
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: c.env?.DATABASE_URL,
                }
            }
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
            }
        });


        return c.json({
            allBlogPosts
        });

    } catch (err) {
        console.error(err);
        return c.json({ message: "Error while fetching all the blog posts" }, 500);
    }
});

//Route to access existing blog post
blogRouter.get('/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate())

        const id = c.req.param("id");
        const existingBlogPost = await prisma.post.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return c.json({
            existingBlogPost
        })


    } catch (err) {
        console.error(err)
        c.status(403)
        c.json({ message: "Error while fetching your blog post" })
    }
})

blogRouter.use('/*', async (c, next) => {
    try {
        const authHeader = c.req.header("Authorization") || "";
        if (!authHeader.startsWith("Bearer ")) {
            return c.json({ error: "Unauthorized" }, 403);
        }

        const token = authHeader.split(" ")[1];

        const user = await verify(token, c.env.JWT_SECRET)

        if (user && typeof user.id === 'string') {
            c.set("userId", user.id)
            await next()
        } else {
            c.status(403)
            return c.json({ error: "Unauthorized" })
        }

        console.log("Authorization Header:", c.req.header("Authorization"));


    } catch (err) {
        console.error(err)
        c.status(403)
        return c.json({ error: "Unauthorized" })
    }
})

// Route for creating a new blog post
blogRouter.post("/", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());

        const body = await c.req.json();
        const { success } = updateBlog.safeParse(body)
        if (!success) {
            c.status(411)
            return c.json({
                message: "Invalid Inputs"
            })
        }

        const authorId = c.get("userId");

        const newBlogPost = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
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
        c.status(403);
        return c.json({ message: "Post not created" });
    }
});


//Route for updating the blog post
blogRouter.put('/', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate())

        const body = await c.req.json();
        const { success } = updateBlog.safeParse(body)
        if (!success) {
            c.status(411)
            return c.json({
                message: "Invalid Inputs"
            })
        }
        const updateBlogPost = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })

        return c.json({
            id: updateBlogPost.id
        })
    } catch (err) {
        console.error(err)
        c.status(403)
        c.json({ message: "Post did not update" })
    }
})


