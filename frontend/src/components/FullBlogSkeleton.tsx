import NavBar from "./NavBar";

const FullBlogSkeleton = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <NavBar />

            <div className="flex justify-center mt-10 px-4 md:px-0 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-screen-lg">
                    {/* Blog Content */}
                    <div className="md:col-span-8 space-y-4">
                        <div className="h-10 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-11/12" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    </div>

                    {/* Author Sidebar */}
                    <div className="md:col-span-4 border-l md:pl-6 pl-0 pt-4 md:pt-0 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full" />
                            <div className="ml-4 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24" />
                                <div className="h-3 bg-gray-200 rounded w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullBlogSkeleton;
