import { verify } from 'hono/jwt'
import type { MiddlewareHandler } from 'hono'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header('Authorization') || ''
    if (!authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 403)
    }

    try {
        const token = authHeader.split(' ')[1]
        const user = await verify(token, c.env.JWT_SECRET)
        if (user && typeof user.id === 'string') {
            c.set('userId', user.id)
            await next()
        } else {
            return c.json({ error: 'Unauthorized' }, 403)
        }
    } catch (err) {
        console.error('JWT error:', err)
        return c.json({ error: 'Unauthorized' }, 403)
    }
}
