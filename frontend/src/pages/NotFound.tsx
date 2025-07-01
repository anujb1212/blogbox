const NotFound = () => {
    return (
        <div className='h-screen flex items-center justify-center bg-slate-100 text-center px-4'>
            <div>
                <h1 className='text-5xl font-bold text-gray-800 mb-4'>404</h1>
                <p className='text-lg text-gray-600 mb-6'>Page not found</p>
                <a href='/' className='text-blue-600 underline text-sm'>
                    Go back home
                </a>
            </div>
        </div>
    )
}

export default NotFound
