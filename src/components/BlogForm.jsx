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
import { useAuth } from "../utils/AuthContext";

function BlogForm() {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading: userLoading, checkAuth } = useAuth();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    userId: "",
    authorName: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auth verification
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
        setAuthChecked(true);
      } catch (err) {
        toast.error("Please log in to create a blog");
        navigate("/login");
      }
    };

    if (!user && !userLoading) {
      verifyAuth();
    } else {
      setAuthChecked(true);
    }
  }, [user, userLoading, checkAuth, navigate]);

  // Set user data when available
  useEffect(() => {
    if (user && authChecked) {
      setBlog(prev => ({
        ...prev,
        userId: user.$id,
        authorName: user.name || "",
      }));
    }
  }, [user, authChecked]);

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      if (!user?.$id) {
        throw new Error("Please log in to upload images.");
      }

      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_IMAGE_SIZE) {
        throw new Error("Image size must be less than 5MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file");
      }

      const fileId = ID.unique();
      await storage.createFile(BUCKET_ID, fileId, file);

      return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final auth check before submission
    try {
      await checkAuth();
    } catch (err) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (!blog.title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const permissions = [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
        Permission.read(Role.any()), // Public read access
      ];

      const content = editorRef.current?.getContent() || "";
      
      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { ...blog, content },
        permissions
      );

      toast.success("Blog published successfully!");
      navigate("/");
    } catch (err) {
      console.error("Publish error:", err);
      toast.error(err.message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  };

  const editorConfig = {
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
      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | preview",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    automatic_uploads: true,
    file_picker_types: "image",
    file_picker_callback: (cb, value, meta) => {
      if (meta.filetype === "image") {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;

          const loadingToast = toast.loading("Uploading image...");
          try {
            const imageUrl = await handleImageUpload(file);
            toast.dismiss(loadingToast);
            toast.success("Image uploaded successfully!");
            cb(imageUrl, { title: file.name });
          } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(`Image upload failed: ${err.message}`);
          }
        };
        input.click();
      }
    },
    images_upload_handler: async (blobInfo, success, failure) => {
      try {
        const imageUrl = await handleImageUpload(blobInfo.blob());
        success(imageUrl);
      } catch (err) {
        failure(err.message);
      }
    },
  };

  if (userLoading || !authChecked) {
    return <div className="text-center text-gray-600 py-10">Verifying session...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500 py-10">Redirecting to login...</div>;
  }

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
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter blog title..."
            disabled={loading || uploadingImage}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Content
          </label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={editorConfig}
            disabled={loading || uploadingImage}
          />
          {uploadingImage && (
            <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-400"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default BlogForm;