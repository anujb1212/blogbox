import { Blog } from '../hooks'
import { Avatar } from './BlogCard'
import NavBar from './NavBar'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { jwtDecode } from 'jwt-decode'
import { useToast } from '../hooks'
import ToastRenderer from './ToastRenderer'
import DOMPurify from 'dompurify'

const FullBlog = ({ blog }: { blog: Blog }) => {
    const navigate = useNavigate()
    const { toastMessage, toastType, show, clear } = useToast()

    const publishedDate = new Date(
        blog.createdAt || blog.publishedAt || Date.now()
    ).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const token = localStorage.getItem('token')
    let isAuthor = false

    try {
        if (token) {
            const decoded: { id: string } = jwtDecode(token)
            isAuthor = decoded.id === blog.author?.id
        }
    } catch (err) {
        console.error('JWT decode failed:', err)
    }

    const handleDelete = async () => {
        if (!token) {
            show('Unauthorized', 'error')
            return
        }

        const confirmed = window.confirm('Are you sure you want to delete this post?')
        if (!confirmed) return

        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            show('Blog deleted successfully', 'success')
            setTimeout(() => navigate('/blogs'), 1000)
        } catch (err) {
            console.error('Delete error:', err)
            show('Failed to delete blog', 'error')
        }
    }

    const sanitizedContent = DOMPurify.sanitize(blog.content);

    return (
        <div className='min-h-screen bg-white text-gray-900'>
            <NavBar />
            <div className='flex justify-center mt-10 px-4 md:px-0'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-screen-lg'>
                    <div className='md:col-span-8'>
                        <h1 className='text-4xl font-bold leading-tight mb-2'>{blog.title}</h1>
                        <p className='text-sm text-gray-500 mb-6'>Posted on {publishedDate}</p>
                        <div
                            className='text-lg leading-relaxed text-gray-800'
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    </div>
                    <div className='md:col-span-4 border-l md:pl-6 pl-0 pt-4 md:pt-0'>
                        <h2 className='text-lg font-semibold text-gray-700 mb-4'>About the Author</h2>
                        <div className='flex items-center'>
                            <Avatar size='big' name={blog.author?.name || 'Anonymous'} />
                            <div className='ml-4'>
                                <p className='text-md font-semibold'>{blog.author?.name || 'Anonymous'}</p>
                                <p className='text-sm text-gray-500 mt-1'>
                                    Passionate writer sharing thoughts on tech, ideas, and life.
                                </p>
                            </div>
                        </div>

                        {isAuthor && (
                            <div className='mt-6 space-y-2'>
                                <button
                                    onClick={handleDelete}
                                    className='bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg'>
                                    Delete Blog
                                </button>
                                <br />
                                <Link to={`/edit/${blog.id}`}>
                                    <button className='text-blue-600 underline text-sm'>Edit Blog</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastRenderer message={toastMessage} type={toastType} onClose={clear} />
        </div>
    )
}

export default FullBlog