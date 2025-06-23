import { Link } from "react-router-dom";

interface BlogCardProps {
    id: string;
    authorName: string;
    createdAt: string;
    title: string;
    content: string;
}

const BlogCard = ({
    id,
    authorName,
    createdAt,
    title,
    content
}: BlogCardProps) => {

    const publishedDate = new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <Link to={`/blog/${id}`}>
            <div className="w-[75%] mx-auto p-8 mb-6 shadow-md h-auto relative z-0 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex">
                    <div className="flex justify-center flex-col">
                        <Avatar name={authorName} size="small" />
                    </div>
                    <div className="flex items-center">
                        <div className="flex justify-center flex-col ml-2 text-sm font-medium text-gray-800">
                            {authorName}
                        </div>
                        <div className="flex ml-1 text-sm font-extralight justify-center flex-col text-gray-500">
                            | {publishedDate}
                        </div>
                    </div>
                </div>
                <div className="text-xl font-bold mt-2">
                    {title}
                </div>
                <div className="text-md mt-1">
                    {content.length < 100 ? content : content.slice(0, 100) + "..."}
                </div>
                <div className="mt-5 text-sm font-extralight text-gray-500">
                    {`${Math.ceil(content.length / 100)} min read`}
                </div>
            </div>
        </Link>
    );
};

function Avatar({ name, size = "small" }: { name: string; size: "small" | "big" }) {
    const sizeClasses = size === "small" ? "w-6 h-6 text-xs" : "w-10 h-10 text-md";

    return (
        <div className={`inline-flex items-center justify-center ${sizeClasses} rounded-full overflow-hidden bg-gray-100`}>
            <span className="text-gray-600">
                {name?.[0]?.toUpperCase() || "A"}
            </span>
        </div>
    );
}

export {
    BlogCard,
    Avatar
};
