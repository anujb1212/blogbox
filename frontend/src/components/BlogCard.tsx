import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useToast } from '../hooks'
import ToastRenderer from './ToastRenderer'

interface BlogCardProps {
    id: string
    authorName: string
    createdAt: string
    title: string
    content: string
    authorId?: string
}

const BlogCard = ({
    id,
    authorName,
    createdAt,
    title,
    content,
    authorId
}: BlogCardProps) => {
    const navigate = useNavigate()
    const { toastMessage, toastType, show, clear } = useToast()

    let currentUserId: string | null = null
    const token = localStorage.getItem('token')
    if (token) {
        try {
            const decoded = jwtDecode<{ id: string }>(token)
            currentUserId = decoded.id
        } catch (err) {
            console.error('JWT decode failed:', err)
        }
    }

    const publishedDate = new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()

        const confirmDelete = window.confirm('Are you sure you want to delete this blog?')
        if (!confirmDelete) return

        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            show('Blog deleted successfully', 'success')
            setTimeout(() => window.location.reload(), 1000)
        } catch (err) {
            console.error('Delete failed:', err)
            show('Failed to delete blog', 'error')
        }
    }

    return (
        <>
            <Link to={`/blog/${id}`}>
                <div className='w-[75%] mx-auto p-8 mb-6 shadow-md h-auto relative z-0 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer'>
                    <div className='flex'>
                        <div className='flex justify-center flex-col'>
                            <Avatar name={authorName} size='small' />
                        </div>
                        <div className='flex items-center'>
                            <div className='flex justify-center flex-col ml-2 text-sm font-medium text-gray-800'>
                                {authorName}
                            </div>
                            <div className='flex ml-1 text-sm font-extralight justify-center flex-col text-gray-500'>
                                | {publishedDate}
                            </div>
                        </div>
                    </div>

                    <div className='text-xl font-bold mt-2'>{title}</div>
                    <div className='text-md mt-1'>
                        {content.length < 100 ? content : content.slice(0, 100) + '...'}
                    </div>
                    <div className='mt-5 text-sm font-extralight text-gray-500'>
                        {`${Math.ceil(content.length / 100)} min read`}
                    </div>

                    {currentUserId && authorId === currentUserId && (
                        <div className='mt-4 flex gap-4'>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/edit/${id}`)
                                }}
                                className='text-sm px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50'
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className='text-sm px-3 py-1 rounded-md border border-red-600 text-red-600 hover:bg-red-50'
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </Link>

            <ToastRenderer message={toastMessage} type={toastType} onClose={clear} />
        </>
    )
}

function Avatar({ name, size = 'small' }: { name: string; size: 'small' | 'big' }) {
    const sizeClasses = size === 'small' ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-md'

    return (
        <div className={`inline-flex items-center justify-center ${sizeClasses} rounded-full overflow-hidden bg-gray-100`}>
            <span className='text-gray-600'>{name?.[0]?.toUpperCase() || 'A'}</span>
        </div>
    )
}

export { BlogCard, Avatar }
