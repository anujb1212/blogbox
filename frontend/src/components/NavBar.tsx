import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Avatar } from './BlogCard'

const Navbar = () => {
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/signin')
    }

    // Decode user name from JWT
    const token = localStorage.getItem('token')
    let userName = 'User'

    if (token) {
        try {
            const decoded = jwtDecode<{ name?: string }>(token)
            if (decoded.name) userName = decoded.name
        } catch (err) {
            console.error('JWT decode failed:', err)
        }
    }

    return (
        <nav className='w-full flex justify-between items-center px-6 py-4 shadow'>
            <div className='flex items-center space-x-6'>
                <Link to='/blogs' className='text-3xl font-extrabold hover:text-gray-600'>
                    BlogBox
                </Link>
            </div>

            <div className='flex items-center space-x-4'>
                <Link
                    to='/publish'
                    className='bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition duration-200'
                >
                    New Blog
                </Link>

                <div className='relative'>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='cursor-pointer flex items-center justify-center'
                    >
                        <Avatar name={userName} size='big' />
                    </div>

                    {dropdownOpen && (
                        <div className='absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10'>
                            <Link
                                to='/my-blogs'
                                className='block px-4 py-2 text-sm hover:bg-gray-100'
                                onClick={() => setDropdownOpen(false)}
                            >
                                My Blogs
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
