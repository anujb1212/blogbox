import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { BlogCard } from '../components/BlogCard'
import BlogsSkeleton from '../components/BlogsSkeleton'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import type { Blog } from '../hooks'

export default function MyBlogs() {
    const [loading, setLoading] = useState(true)
    const [blogs, setBlogs] = useState<Blog[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/signin')
            return
        }

        axios
            .get(`${BACKEND_URL}/api/v1/blog/mine`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setBlogs(res.data.userBlogs || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching user blogs:', err)
                setLoading(false)
            })
    }, [navigate])

    if (loading) return <BlogsSkeleton count={5} />

    return (
        <div className='min-h-screen bg-gray-50'>
            <NavBar />
            <div className='py-8'>
                {blogs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
                        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
                            You haven't written any blogs yet
                        </h2>
                        <button
                            onClick={() => navigate('/publish')}
                            className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium'
                        >
                            Write Your First Blog
                        </button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.author?.name || 'You'}
                                createdAt={blog.createdAt}
                                title={blog.title}
                                content={blog.content}
                                authorId={blog.author?.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
