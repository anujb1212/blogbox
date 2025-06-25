import NavBar from "./NavBar";
import BlogCardSkeleton from "./BlogCardSkeleton";

const BlogsSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="bg-white min-h-screen">
            <NavBar />
            <div className="pt-4">
                {[...Array(count)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

export default BlogsSkeleton;
