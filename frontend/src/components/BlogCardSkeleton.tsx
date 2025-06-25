const BlogCardSkeleton = () => {
    return (
        <div className="w-[75%] mx-auto p-8 mb-6 shadow-md h-auto relative z-0 rounded-lg animate-pulse bg-white space-y-4">
            <div className="flex">
                <div className="w-6 h-6 bg-gray-300 rounded-full" />
                <div className="ml-2 flex flex-col justify-center space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-2 bg-gray-200 rounded w-16" />
                </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
    );
};

export default BlogCardSkeleton;
