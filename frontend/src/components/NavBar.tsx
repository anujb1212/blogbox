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
            {/* Left Side Logo and Navigation */}
            <div className='flex items-center space-x-6'>
                <Link to='/blogs' className='text-3xl font-extrabold hover:text-gray-600'>
                    BlogBox
                </Link>
                <Link
                    to='/publish'
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                >
                    Write
                </Link>
            </div>

            {/* Right Side Avatar */}
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
        </nav>
    )
}

export default Navbar
