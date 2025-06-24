import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export interface Blog {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    publishedAt: string;
    author: {
        name: string;
    };
}


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                setBlogs(response.data.allBlogPosts);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching blogs", err);
                setLoading(false);
            });
    }, []);



    return {
        loading,
        blogs
    }
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`);
                console.log("Blog fetched:", res.data);
                setBlog(res.data.existingBlogPost);
                setLoading(false)
            } catch (err) {
                console.error("Fetch error:", err);
                setLoading(false);
            }
        }
        fetchBlog();
    }, [id]);

    return {
        loading,
        blog
    }
}