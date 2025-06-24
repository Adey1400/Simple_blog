import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

function EditBlog({ updateBlog, setView, blog }) {
  const [title, setTitle] = useState(blog.title);
  const [error, setError] = useState("");
  const editorRef = useRef();

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
    setView("home");
  };
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
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={blog.content}
      init={{
        height: 300,
        menubar: false,
        plugins:
          "advlist autolink lists link image preview anchor code fullscreen insertdatetime media table help wordcount",
        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image | code",
      }}
    />
  </div>

  <div className="flex flex-col sm:flex-row justify-between gap-4">
    <button
      type="button"
      onClick={() => setView("home")}
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
