import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <div className='bg-slate-100 min-h-screen flex flex-col justify-center items-center text-center px-4'>
            <h1 className='text-5xl font-extrabold mb-6'>Welcome to Blogbox</h1>
            <p className='text-lg text-gray-600 max-w-xl mb-10'>
                Share your thoughts, stories, and ideas with the world. Login to read and publish amazing blogs.
            </p>
            <div className='flex gap-4'>
                <Link to='/signup'>
                    <button className='bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all cursor-pointer'>
                        Get Started
                    </button>
                </Link>
                <Link to='/signin'>
                    <button className='border border-blue-600 text-blue-600 px-6 py-2 rounded-lg text-sm hover:bg-blue-50 transition-all cursor-pointer'>
                        Sign In
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Landing
