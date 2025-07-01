import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FullBlog from '../components/FullBlog'
import { useBlog } from '../hooks'
import FullBlogSkeleton from '../components/FullBlogSkeleton'

const Blog = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { loading, blog } = useBlog({ id: id || '' })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/signin')
        }
    }, [navigate])

    if (loading) return <FullBlogSkeleton />

    if (!blog || !blog.id) {
        return (
            <div className='min-h-screen flex items-center justify-center text-gray-500 text-lg'>
                Blog not found
            </div>
        )
    }

    return (
        <div>
            <FullBlog blog={blog} />
        </div>
    )
}

export default Blog
