import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ID, Permission, Role } from "appwrite";
import { useNavigate } from "react-router-dom";
import {
  database,
  storage,
  DATABASE_ID,
  COLLECTION_ID,
  BUCKET_ID,
} from "../appwriteConfig";
import { toast } from "react-toastify";

function BlogForm({ user }) {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    userId: user?.$id || "",
    authorName: user?.name || "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blog.title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    setLoading(true);

    const permissions = [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ];

    try {
      if (editorRef.current) {
        blog.content = editorRef.current.getContent();
      }

      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          title: blog.title,
          content: blog.content,
          userId: blog.userId,
          authorName: blog.authorName,
          imageUrl: blog.imageUrl,
        },
        permissions
      );

      toast.success("Blog published successfully!");
      navigate(`/blogs/${response.$id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish blog.");
    } finally {
      setLoading(false);
      if (editorRef.current) {
        editorRef.current.setMode("design");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      const url = storage.getFilePreview(BUCKET_ID, uploadedFile.$id).href;
      setBlog((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create a New Blog
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={blog.title}
            onChange={(e) =>
              setBlog({ ...blog, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter blog title..."
            disabled={loading}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Content
          </label>
          <Editor
            apiKey={import.meta.env.VITE_TINY_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              height: 400,
              menubar: false,
              plugins: "link image code preview emoticons",
              toolbar:
                "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | preview emoticons",
              placeholder: "Write your blog here...",
            }}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt="Uploaded preview"
              className="mt-3 w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Featured Image URL (optional)
          </label>
          <input
            type="text"
            value={blog.imageUrl}
            onChange={(e) =>
              setBlog({ ...blog, imageUrl: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="https://example.com/your-image.jpg"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-400"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default BlogForm;
