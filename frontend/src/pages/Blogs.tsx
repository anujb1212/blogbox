import { BlogCard } from "../components/BlogCard";
import NavBar from "../components/NavBar";
import { useBlogs } from "../hooks";

const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) return <div>Loading...</div>;

    if (!blogs || blogs.length === 0) return <div>No blogs found</div>;

    return (
        <div>
            <NavBar />
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
    );
};

export default Blogs;
