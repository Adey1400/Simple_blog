import React, { useRef, useState } from "react";
import { ID } from "appwrite";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { database, DATABASE_ID, COLLECTION_ID, storage, BUCKET_ID } from "../appwriteConfig";

function BlogForm({ addBlog }) {
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
  const editorRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        title: blog.title,
        content: editorRef.current.getContent(),
        userId: blog.userId,
        authorName: blog.authorName,
        imageUrl: blog.imageUrl, // Optional
      });

      setBlog({
        title: "",
        content: "",
        userId: "",
        authorName: "",
        imageUrl: "",
      });

      editorRef.current.setContent("");
      toast.success("Blog posted successfully!");
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast.error("Error saving blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto mt-8 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
        📝 Create New Blog
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={blog.title}
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter blog title"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Content
        </label>
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist", "autolink", "lists", "link", "image", "preview", "anchor", "searchreplace", "wordcount"
            ],
            toolbar:
              "undo redo | formatselect | bold italic | " +
              "alignleft aligncenter alignright | bullist numlist | link image | preview",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            automatic_uploads: true,
            file_picker_types: "image",
            file_picker_callback: function (cb, value, meta) {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = async function () {
                  const file = input.files[0];
                  if (!file) return;

                  // Show loading toast
                  const loadingToast = toast.loading("Uploading image...");

                  try {
                    // Validate file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                      throw new Error('Image size must be less than 5MB');
                    }

                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                      throw new Error('Please select a valid image file');
                    }

                    const fileId = ID.unique();
                    
                    // Upload file to Appwrite storage
                    await storage.createFile(BUCKET_ID, fileId, file);
                    
                    // Generate the image URL
                    const imageUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                    
                    console.log('Image uploaded successfully:', imageUrl);
                    
                    // Dismiss loading toast and show success
                    toast.dismiss(loadingToast);
                    toast.success("Image uploaded successfully!");
                    
                    // Pass the URL to TinyMCE
                    cb(imageUrl, { title: file.name });
                    
                  } catch (err) {
                    console.error("Image upload failed:", err);
                    toast.dismiss(loadingToast);
                    toast.error(`Image upload failed: ${err.message}`);
                  }
                };

                input.click();
              }
            },
            images_upload_handler: function (blobInfo, success, failure) {
              // Alternative upload handler
              const uploadImage = async () => {
                try {
                  const file = blobInfo.blob();
                  
                  // Validate file size
                  if (file.size > 5 * 1024 * 1024) {
                    throw new Error('Image size must be less than 5MB');
                  }

                  const fileId = ID.unique();
                  await storage.createFile(BUCKET_ID, fileId, file);
                  
                  const imageUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                  
                  success(imageUrl);
                } catch (error) {
                  console.error('Upload error:', error);
                  failure(`Upload failed: ${error.message}`);
                }
              };

              uploadImage();
            }
          }}
        />
      </div>

      <div className="flex justify-center sm:justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
}

export default BlogForm;
