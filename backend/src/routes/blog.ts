import { createBlog, updateBlog } from '@anujb_dev/blogbox-common'
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

interface Environment {
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}

export const blogRouter = new Hono<Environment>()

// Public route
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

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
        })

        return c.json({ allBlogPosts })
    } catch (err) {
        console.error(err)
        return c.json({ message: 'Error while fetching all the blog posts' }, 500)
    }
})

// Protected route 
blogRouter.get('/mine', authMiddleware, async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const userId = c.get('userId')

        const userBlogs = await prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
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
        })

        return c.json({ userBlogs })
    } catch (err) {
        console.error('User blogs fetch error:', err)
        return c.json({ message: 'Failed to fetch user blogs' }, 500)
    }
})

// Public route 
blogRouter.get('/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const id = c.req.param('id')

        const existingBlogPost = await prisma.post.findFirst({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        if (!existingBlogPost) {
            return c.json({ message: 'Blog post not found' }, 404)
        }

        return c.json({ existingBlogPost })
    } catch (err) {
        console.error(err)
        return c.json({ message: 'Error while fetching the blog post' }, 500)
    }
})

// Protected route
blogRouter.post('/', authMiddleware, async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json()
        const parsed = createBlog.safeParse(body)

        if (!parsed.success) {
            return c.json({ message: 'Invalid Inputs', errors: parsed.error.errors }, 411)
        }

        const authorId = c.get('userId')

        const newBlogPost = await prisma.post.create({
            data: {
                title: parsed.data.title,
                content: parsed.data.content,
                authorId: authorId,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return c.json({
            id: newBlogPost.id,
            title: newBlogPost.title,
            createdAt: newBlogPost.createdAt
        })
    } catch (err) {
        console.error('Post Error:', err)
        return c.json({ message: 'Post not created' }, 500)
    }
})

// Protected route
blogRouter.put('/', authMiddleware, async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json()
        const parsed = updateBlog.safeParse(body)

        if (!parsed.success) {
            return c.json({ message: 'Invalid Inputs', errors: parsed.error.errors }, 411)
        }

        const userId = c.get('userId')

        const existingPost = await prisma.post.findFirst({
            where: {
                id: parsed.data.id,
                authorId: userId
            }
        })

        if (!existingPost) {
            return c.json({ message: 'Unauthorized or blog not found' }, 403)
        }

        const updatedPost = await prisma.post.update({
            where: { id: parsed.data.id },
            data: {
                title: parsed.data.title,
                content: parsed.data.content
            }
        })

        return c.json({ id: updatedPost.id })
    } catch (err) {
        console.error(err)
        return c.json({ message: 'Post did not update' }, 500)
    }
})

// Protected route
blogRouter.delete('/:id', authMiddleware, async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const blogId = c.req.param('id')
        const userId = c.get('userId')

        const existingPost = await prisma.post.findFirst({
            where: {
                id: blogId,
                authorId: userId
            }
        })

        if (!existingPost) {
            return c.json({ message: 'Unauthorized or Blog not found' }, 403)
        }

        await prisma.post.delete({
            where: { id: blogId }
        })

        return c.json({ message: 'Blog deleted successfully' })
    } catch (err) {
        console.error('Delete error:', err)
        return c.json({ message: 'Failed to delete post' }, 500)
    }
})

export default blogRouter
