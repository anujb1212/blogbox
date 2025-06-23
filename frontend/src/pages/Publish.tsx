import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";
import NavBar from "../components/NavBar";

export default function MediumEditor() {
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

    return (
        <div>
            <div>
                <NavBar />
            </div>
            <div className="max-w-3xl mx-auto mt-10 p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
                {/* Toolbar */}
                <div className="flex gap-2 mb-4 flex-wrap border-b pb-2">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("bold") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        B
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("italic") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        I
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("heading", { level: 1 }) ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("bulletList") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className={`px-2 py-1 rounded ${editor?.isActive("blockquote") ? "bg-gray-800 text-white" : "bg-gray-100"
                            }`}
                    >
                        Quote
                    </button>
                    <button
                        onClick={addImage}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                        🖼 Image
                    </button>
                </div>

                {/* Editor Area */}
                <EditorContent
                    editor={editor}
                    className="prose prose-lg focus:outline-none min-h-[300px]"
                />
            </div>
        </div>

    );
}
