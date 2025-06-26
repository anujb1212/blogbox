import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import BlogsSkeleton from "../components/BlogsSkeleton";
import NavBar from "../components/NavBar";
import { useBlogs } from "../hooks";

const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
            navigate("/signin");
        }
    }, [navigate]);

    if (loading) return <BlogsSkeleton count={6} />

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="py-8">
                {!blogs || blogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            No blogs found
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Be the first to share your thoughts with the world!
                        </p>
                        <button
                            onClick={() => navigate("/publish")}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Write Your First Blog
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blogs.map(blog => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.author.name || "Anonymous"}
                                createdAt={blog.createdAt}
                                title={blog.title}
                                content={blog.content}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;