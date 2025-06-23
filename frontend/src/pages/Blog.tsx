import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullBlog from "../components/FullBlog";
import { useBlog } from "../hooks";

const Blog = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
        }
    },);

    const { id } = useParams()
    const { loading, blog } = useBlog({
        id: id || ""
    });

    if (loading) return <div>Loading...</div>

    if (!blog) return <div>Not found</div>;

    return (
        <div>
            <FullBlog blog={blog} />
        </div>
    )
}

export default Blog