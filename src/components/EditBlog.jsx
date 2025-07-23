import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import { database , DATABASE_ID , COLLECTION_ID} from "../appwriteConfig"; 


function EditBlog({ updateBlog, blogs }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    userId: "",
    authorName: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const editorRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await database.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setBlog({
          title: res.title,
          content: res.content,
          userId: res.userId,
          authorName: res.authorName,
          imageUrl: res.imageUrl || "",
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Blog not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateContent = editorRef.current.getContent();

    if (!blog.title.trim() || !updateContent.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
        title: blog.title,
        content: updateContent,
        userId: blog.userId,
        authorName: blog.authorName,
        imageUrl: blog.imageUrl,
      });

      toast.success("Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (error) {
      toast.error("Failed to update blog");
      console.error("Failed to update blog", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-6">⏳ Loading blog...</div>
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
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
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
          initialValue={blog.content}
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
              "anchor",
            ],
            toolbar:
              "undo redo | formatselect | bold italic underline | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist | link image",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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
