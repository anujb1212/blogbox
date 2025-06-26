import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export interface Blog {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    publishedAt?: string;
    author: {
        name: string;
        id: string
    };
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`)
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

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("token");

            if (!token || token === "undefined") {
                setIsAuthenticated(false);
                navigate("/signin");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("https://your-backend.com/api/validate-token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    navigate("/signin");
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.error("Token validation error:", err.message);
                } else {
                    console.error("Unknown error during token validation:", err);
                }

                localStorage.removeItem("token");
                setIsAuthenticated(false);
                navigate("/signin");
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return { isAuthenticated, loading, logout };
}