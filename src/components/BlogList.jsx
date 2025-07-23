import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  database,
  DATABASE_ID,
  COLLECTION_ID,
  account,
} from "../appwriteConfig";

import { IoTimeOutline, IoTrashOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import Break from "../assets/Breaking.jpg"; // default image
import {
  extractFirstImageFromContent,
  extractTextFromContent,
} from "../utils/extractImage";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const getPreviewImage = (blog) => {
    if (blog.imageUrl) {
      return blog.imageUrl;
    }

    const contentImage = extractFirstImageFromContent(blog.content);
    if (contentImage) {
      return contentImage;
    }

    return Break;
  };

  // Fetch current user details
  const getAuthorName = (blog) => {
    // First try to use the stored authorName
    if (blog.authorName && blog.authorName.trim() !== "") {
      return blog.authorName;
    }

    // If no authorName and this is the current user's blog, use current user info
    if (currentUser && blog.userId === currentUser.$id) {
      return currentUser.name || currentUser.email || "You";
    }

    // Fallback to Unknown Author
    return "Unknown Author";
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (error) {
        // User not logged in, which is fine
        setCurrentUser(null);
      }
    };
    const fetchBlogs = async () => {
      try {
        const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID);
        setBlogs(res.documents);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      setBlogs((prev) => prev.filter((blog) => blog.$id !== id));
      toast.success("Blog deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete blog.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-6">Loading blogs...</div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-6">No blogs found.</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => {
        const previewImage = getPreviewImage(blog);

        return (
          <div
            key={blog.$id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-gray-200 flex flex-col"
            style={{ minHeight: "400px" }}
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={previewImage}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = Break;
                }}
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <div>
                <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3">
                  {blog.title}
                </h2>
                <div className="flex bg-gray justify-between items-center text-sm text-gray-500 mt-1">
                  <p className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-300">✍️ By: {getAuthorName(blog)}</p>
                  <div className="flex items-center">
                    <IoTimeOutline className="mr-1" />
                    {new Date(blog.$createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Spacer to push buttons to bottom */}
              <div className="flex-grow"></div>

              {/* Read & Delete buttons */}
              <div className="flex justify-between items-center pt-3 mt-4 border-t border-gray-100">
                <Link
                  to={`/blog/${blog.$id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Read More <FiArrowRight className="ml-1" />
                </Link>
                {currentUser && currentUser.$id === blog.userId &&(
 <button
                  onClick={() => handleDelete(blog.$id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  title="Delete Blog"
                >
                  <IoTrashOutline size={20} />
                </button>
                )}
                
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BlogList;
