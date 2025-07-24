import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoCloudUploadOutline, IoTrashOutline, IoImageOutline } from "react-icons/io5";
import {
  database,
  DATABASE_ID,
  COLLECTION_ID,
  storage,
  BUCKET_ID,
} from "../appwriteConfig";
import { ID } from "appwrite";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");

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
        setNewImagePreview(res.imageUrl || "");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setNewImageFile(null);
    setNewImagePreview("");
    setBlog({ ...blog, imageUrl: "" });
    
    // Clear file input
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    
    const updateContent = editorRef.current.getContent();

    if (!blog.title.trim() || !updateContent.trim()) {
      setError("Title and content are required");
      return;
    }

    let imageUrl = blog.imageUrl;

    // Upload new image if selected
    if (newImageFile) {
      try {
        setUploadingImage(true);
        const uploaded = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          newImageFile
        );
        
        // Use getFileView instead of getFilePreview for better compatibility
        const fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id);
        imageUrl = fileUrl.toString();
      } catch (error) {
        toast.error("Image upload failed");
        console.error(error);
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    try {
      const updatedData = {
        title: blog.title.trim(),
        content: updateContent,
        userId: blog.userId,
        authorName: blog.authorName,
        imageUrl: imageUrl || "", // Ensure we don't pass undefined
      };

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, id, updatedData);

      toast.success("Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (error) {
      toast.error("Failed to update blog");
      console.error("Failed to update blog", error);
      setError("Failed to update blog. Please try again.");
    }
  };

  const editorConfig = {
    height: 500,
    menubar: false,
    plugins: "link image code lists",
    toolbar:
      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
    content_style: "body { white-space: pre-wrap; }",
    forced_root_block: "",
    force_br_newlines: true,
    force_p_newlines: false,
    entity_encoding: "raw",
    verify_html: false,
    convert_urls: false,
    trim_span_elements: false,
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

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Title
        </label>
        <input
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter updated title"
          disabled={uploadingImage}
        />
      </div>

      {/* Featured Image Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image (Optional)
        </label>
        
        {/* Image Preview */}
        {newImagePreview && (
          <div className="mb-4 relative">
            <img
              src={newImagePreview}
              alt="Preview"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <IoTrashOutline size={16} />
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploadingImage}
          />
          
          {!newImagePreview ? (
            <div>
              <IoImageOutline className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label
                htmlFor="image-input"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <IoCloudUploadOutline className="mr-2" />
                Choose Featured Image
              </label>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">Featured image selected</p>
              <label
                htmlFor="image-input"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <IoCloudUploadOutline className="mr-2" />
                Change Image
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Content
        </label>
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={blog.content}
          init={editorConfig}
          disabled={loading || uploadingImage}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(`/blog/${id}`)}
          className="text-gray-600 border border-gray-300 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-100 transition-all w-full sm:w-auto"
          disabled={uploadingImage}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 w-full sm:w-auto"
        >
          {uploadingImage ? "Uploading Image..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EditBlog;