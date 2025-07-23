import React, { useRef, useState, useEffect } from "react";
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
    userId: "",
    authorName: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set user data once available
  useEffect(() => {
    if (user) {
      setBlog((prev) => ({
        ...prev,
        userId: user.$id || "",
        authorName: user.name || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!user || !user.$id) {
    toast.error("Please log in to create a blog.");
    return;
  }

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
          ...blog,
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create a New Blog
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={blog.title || ""}
            onChange={(e) =>
              setBlog({ ...blog, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter blog title..."
            disabled={loading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* TinyMCE Editor */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
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
                "searchreplace",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image | preview",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              automatic_uploads: true,
              file_picker_types: "image",
              file_picker_callback: function (cb, value, meta) {
                if (meta.filetype === "image") {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = async function () {
                    const file = input.files[0];
                    if (!file) return;

                    const loadingToast = toast.loading("Uploading image...");

                    try {
                      if (file.size > 5 * 1024 * 1024) {
                        throw new Error("Image must be under 5MB.");
                      }

                      const fileId = ID.unique();
                      await storage.createFile(BUCKET_ID, fileId, file);

                      const imageUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;

                      toast.dismiss(loadingToast);
                      toast.success("Image uploaded!");
                      cb(imageUrl, { title: file.name });
                    } catch (err) {
                      console.error("Image upload failed:", err);
                      toast.dismiss(loadingToast);
                      toast.error(`Upload failed: ${err.message}`);
                    }
                  };

                  input.click();
                }
              },
              images_upload_handler: async (blobInfo, success, failure) => {
                try {
                  const file = blobInfo.blob();
                  if (file.size > 5 * 1024 * 1024) {
                    throw new Error("Image must be under 5MB.");
                  }

                  const fileId = ID.unique();
                  await storage.createFile(BUCKET_ID, fileId, file);

                  const imageUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                  success(imageUrl);
                } catch (error) {
                  console.error("Image upload error:", error);
                  failure(`Upload failed: ${error.message}`);
                }
              },
            }}
            onInit={(evt, editor) => (editorRef.current = editor)}
          />
        </div>

        {/* Submit Button */}
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
