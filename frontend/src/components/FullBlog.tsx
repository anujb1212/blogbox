import { Blog } from "../hooks";
import { Avatar } from "./BlogCard";
import NavBar from "./NavBar";

const FullBlog = ({ blog }: { blog: Blog }) => {
    const publishedDate = new Date(blog.createdAt || blog.publishedAt || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <NavBar />
            <div className="flex justify-center mt-10 px-4 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-screen-lg">

                    {/* Blog Content */}
                    <div className="md:col-span-8">
                        <h1 className="text-4xl font-bold leading-tight mb-2">
                            {blog.title}
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Posted on {publishedDate}
                        </p>
                        <div
                            className="text-lg leading-relaxed text-gray-800"
                            dangerouslySetInnerHTML={{ __html: blog.content }} // render HTML
                        />
                    </div>

                    {/* Author Sidebar */}
                    <div className="md:col-span-4 border-l md:pl-6 pl-0 pt-4 md:pt-0">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            About the Author
                        </h2>
                        <div className="flex items-center">
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            <div className="ml-4">
                                <p className="text-md font-semibold">
                                    {blog.author.name || "Anonymous"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Passionate writer sharing thoughts on tech, ideas, and life.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FullBlog
