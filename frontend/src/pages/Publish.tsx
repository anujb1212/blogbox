import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import axios from 'axios'
import { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config'
import NavBar from '../components/NavBar'
import ToastRenderer from '../components/ToastRenderer'
import { useToast } from '../hooks'

export default function Publish() {
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { toastMessage, toastType, show, clear } = useToast()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) navigate('/signin')
    }, [navigate])

    const editor = useEditor({
        extensions: [StarterKit, Image, Link],
        content: ''
    })

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL')
        if (url) editor?.chain().focus().setImage({ src: url }).run()
    }, [editor])

    const handlePublish = async () => {
        if (loading) return

        const blogContent = editor?.getHTML()
        const token = localStorage.getItem('token')

        if (!token || token === 'undefined' || token.trim() === '') {
            show('You are not logged in', 'error')
            navigate('/signin')
            return
        }

        if (!title.trim()) {
            show('Title is required', 'error')
            return
        }

        if (!blogContent || blogContent.trim() === '' || blogContent === '<p></p>') {
            show('Content is required', 'error')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                {
                    title: title.trim(),
                    content: blogContent
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            show('Blog published successfully', 'success')
            setTimeout(() => navigate(`/blog/${response.data.id}`), 1000)
        } catch (error: unknown) {
            console.error('Publish error:', error)

            let errorMessage = 'Failed to publish blog'
            let statusCode: number | undefined

            if (error && typeof error === 'object') {
                const err = error as {
                    response?: {
                        data?: { message?: string }
                        status?: number
                    }
                    message?: string
                }

                errorMessage = err.response?.data?.message || err.message || errorMessage
                statusCode = err.response?.status
            }

            show(errorMessage, 'error')

            if (statusCode === 403) {
                localStorage.removeItem('token')
                navigate('/signin')
            }
        } finally {
            setLoading(false)
        }
    }

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

                <div className='flex gap-2 mb-4 flex-wrap border-b pb-2'>
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive('bold') ? 'bg-gray-800 text-white' : 'bg-gray-100'
                            }`}
                    >
                        B
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive('italic') ? 'bg-gray-800 text-white' : 'bg-gray-100'
                            }`}
                    >
                        𝐼
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-800 text-white' : 'bg-gray-100'
                            }`}
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive('bulletList') ? 'bg-gray-800 text-white' : 'bg-gray-100'
                            }`}
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive('blockquote') ? 'bg-gray-800 text-white' : 'bg-gray-100'
                            }`}
                    >
                        ❝ Quote
                    </button>
                    <button
                        onClick={addImage}
                        className='px-2 py-1 cursor-pointer rounded bg-gray-100 hover:bg-gray-200'
                    >
                        🖼 Image
                    </button>
                </div>

                <div className='relative'>
                    {!editor?.getText().length && (
                        <p className='absolute top-0 left-0 text-gray-400 pointer-events-none select-none p-1'>
                            Start writing your story...
                        </p>
                    )}
                    <EditorContent editor={editor} className='prose prose-lg min-h-[300px] outline-none focus:outline-none' />
                </div>
            </div>

            <div className='max-w-3xl mx-auto mt-4 flex justify-end'>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className='bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? 'Publishing...' : 'Publish Post'}
                </button>
            </div>

            <ToastRenderer message={toastMessage} type={toastType} onClose={clear} />
        </>
    )
}
