import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export default function Publish() {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [StarterKit, Image, Link],
        content: "",
    });

    const addImage = useCallback(() => {
        const url = window.prompt("Enter image URL");
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const handlePublish = async () => {
        const blogContent = editor?.getHTML();
        const token = localStorage.getItem("token");

        if (!token || token === "undefined" || token.trim() === "") {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                title,
                content: blogContent,
                createdAt: new Date().toISOString()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Blog published successfully!")
            console.log("Response:", response.data.id)
            navigate(`/blog/${response.data.id}`)

        } catch (error) {
            console.error("Publish error:", error);
            alert("Failed to publish blog");
        }
    };

    return (
        <>
            <div className="max-w-3xl mx-auto mt-10 p-4 border border-gray-300 rounded-xl shadow-md bg-white">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-3xl font-semibold mb-4 outline-none placeholder-gray-400"
                />

                {/* Toolbar */}
                <div className="flex gap-2 mb-4 flex-wrap border-b pb-2">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive("bold") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        B
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive("italic") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        𝐼
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive("heading", { level: 1 }) ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive("bulletList") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className={`px-2 py-1 cursor-pointer hover:bg-gray-200 rounded ${editor?.isActive("blockquote") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        ❝ Quote
                    </button>
                    <button
                        onClick={addImage}
                        className="px-2 py-1 cursor-pointer rounded bg-gray-100 hover:bg-gray-200"
                    >
                        🖼 Image
                    </button>
                </div>

                {/* Editor Area with Tailwind Placeholder */}
                <div className="relative">
                    {!editor?.getText().length && (
                        <p className="absolute top-0 left-0 text-gray-400 pointer-events-none select-none p-1">
                            Start writing your story...
                        </p>
                    )}
                    <EditorContent
                        editor={editor}
                        className="prose prose-lg min-h-[300px] outline-none focus:outline-none"
                    />
                </div>
            </div>

            {/* Publish Button */}
            <div className="max-w-3xl mx-auto mt-4 flex justify-end">
                <button
                    onClick={handlePublish}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl"
                >
                    Publish Post
                </button>
            </div>
        </>
    );
}
