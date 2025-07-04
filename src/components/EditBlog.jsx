import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";

function EditBlog({ updateBlog, blogs }) {
  const { id } = useParams(); // ✅ get blog ID from URL
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === Number(id)); // ✅ match blog by number

  const [title, setTitle] = useState(blog ? blog.title : "");
  const [error, setError] = useState("");
  const editorRef = useRef();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
    }
  }, [blog]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updateContent = editorRef.current.getContent();

    if (!title.trim() || !updateContent.trim()) {
      setError("Title and content are required");
      return;
    }

    updateBlog({
      ...blog,
      title,
      content: updateContent,
    });

    navigate(`/blog/${id}`);
  };

  if (!blog) {
    return (
      <div className="text-center text-gray-500 mt-6">
        ❌ Blog not found.
        <button
          className="ml-2 underline text-blue-600"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="w-full max-w-3xl mx-auto mt-8 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
        ✏️ Edit Blog
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Enter updated title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Content
        </label>
       <Editor
  apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // Or use your actual API key as a string temporarily
  init={{
    height: 300,
    menubar: false,
  plugins: [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "preview",
  "anchor"
],
toolbar:
  'undo redo | formatselect | bold italic underline | ' +
  'alignleft aligncenter alignright alignjustify | ' +
  'bullist numlist | link image',
    content_style:
      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
  }}
  onInit={(evt, editor) => (editorRef.current = editor)}
/>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(`/blog/${id}`)}
          className="text-gray-600 border border-gray-300 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-100 transition-all w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-yellow-700 transition-all w-full sm:w-auto"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditBlog;
