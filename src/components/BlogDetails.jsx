import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database, DATABASE_ID, COLLECTION_ID } from "../appwriteConfig";
import { toast } from "react-toastify";
import Blog from "../assets/Breaking.jpg";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await database.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setBlog(res);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-6">Loading blog...</div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6 px-4 sm:px-6 md:px-8 bg-white p-6 sm:p-8 rounded-xl shadow-md text-center">
        <p className="text-base sm:text-lg text-gray-500">❌ Blog Not Found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-4 sm:px-6 md:px-8 p-6 sm:p-8 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
        {blog.title}
      </h2>

      <img
        src={blog.imageUrl || Blog}
        alt="cover"
        className="w-full h-64 object-cover rounded-lg"
      />

      <p className="text-xs sm:text-sm text-gray-500 italic">
        🕒 {new Date(blog.$createdAt).toLocaleString()}
      </p>

      <div
        className="text-gray-700 leading-relaxed prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          ⬅ Back to Home
        </button>

        <button
          onClick={() => navigate(`/edit/${id}`)}
          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
}

export default BlogDetails;
