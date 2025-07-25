import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBlog, useToast } from '../hooks'
import { BACKEND_URL } from '../config'
import axios from 'axios'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import NavBar from '../components/NavBar'
import { jwtDecode } from 'jwt-decode'
import ToastRenderer from '../components/ToastRenderer'

export default function EditBlog() {
    const { id } = useParams()
    const { loading, blog } = useBlog({ id: id || '' })
    const [title, setTitle] = useState('')
    const [updating, setUpdating] = useState(false)
    const navigate = useNavigate()
    const { toastMessage, toastType, show, clear } = useToast()

    const editor = useEditor({
        extensions: [StarterKit, Image, Link],
        content: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            show('You are not logged in', 'error')
            navigate('/signin')
            return
        }

        if (blog) {
            try {
                const decoded: { id: string } = jwtDecode(token)
                if (decoded.id !== blog.author.id) {
                    show('You are not authorized to edit this blog', 'error')
                    navigate(`/blog/${blog.id}`)
                    return
                }
            } catch (err) {
                console.error('JWT decode failed:', err)
                show('Invalid token. Please sign in again.', 'error')
                navigate('/signin')
            }
        }
    }, [blog, navigate, show])

    useEffect(() => {
        if (blog) {
            setTitle(blog.title)
            editor?.commands.setContent(blog.content)
        }
    }, [blog, editor])

    const handleUpdate = async () => {
        if (updating) return

        const token = localStorage.getItem('token')
        if (!token) {
            show('You are not logged in', 'error')
            navigate('/signin')
            return
        }

        if (!title.trim()) {
            show('Title is required', 'error')
            return
        }

        const content = editor?.getHTML()
        if (!content || content.trim() === '' || content === '<p></p>') {
            show('Content is required', 'error')
            return
        }

        setUpdating(true)

        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/v1/blog`,
                {
                    id,
                    title: title.trim(),
                    content
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            show('Blog updated successfully', 'success')
            setTimeout(() => navigate(`/blog/${response.data.id}`), 1000)
        } catch (err: unknown) {
            console.error('Update error:', err)

            let errorMessage = 'Failed to update blog'
            let statusCode: number | undefined

            if (err && typeof err === 'object') {
                const error = err as {
                    response?: {
                        data?: { message?: string }
                        status?: number
                    }
                    message?: string
                }

                errorMessage =
                    error.response?.data?.message || error.message || errorMessage
                statusCode = error.response?.status
            }

            show(errorMessage, 'error')

            if (statusCode === 403) navigate('/signin')
        } finally {
            setUpdating(false)
        }
    }

    if (loading || !blog)
        return (
            <div>
                <NavBar />
                <div className='flex justify-center items-center min-h-[50vh]'>
                    <div>Loading...</div>
                </div>
                <ToastRenderer message={toastMessage} type={toastType} onClose={clear} />
            </div>
        )

    return (
        <>
            <NavBar />
            <div className='max-w-3xl mx-auto mt-10 p-4 border border-gray-300 rounded-xl shadow-md bg-white'>
                <input
                    type='text'
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='w-full text-3xl font-semibold mb-4 outline-none placeholder-gray-400'
                />
                <EditorContent
                    editor={editor}
                    className='prose prose-lg min-h-[300px] outline-none focus:outline-none'
                />
                <div className='mt-4 flex justify-end'>
                    <button
                        onClick={handleUpdate}
                        disabled={updating}
                        className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {updating ? 'Updating...' : 'Update Post'}
                    </button>
                </div>
            </div>

            <ToastRenderer message={toastMessage} type={toastType} onClose={clear} />
        </>
    )
}
