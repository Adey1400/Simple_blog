import React, { useEffect, useState } from "react";
import { database, DATABASE_ID, COLLECTION_ID, storage, BUCKET_ID } from "../appwriteConfig";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import { IoTimeOutline, IoTrashOutline } from "react-icons/io5";
import { Query } from "appwrite";
import { toast } from "react-toastify";
import LoadingSpinner from "./Loading";
import DefaultImage from "../assets/Breaking.jpg";

const MyBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const response = await database.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
        );
        setBlogs(response.documents);
      } catch (error) {
        toast.error("Failed to load blogs");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyBlogs();
  }, [user]);

  const handleDelete = async (blog) => {
    const confirm = window.confirm(`Delete "${blog.title}"?`);
    if (!confirm) return;

    try {
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID, blog.$id);

      if (blog.imageUrl) {
        const imageId = blog.imageUrl.split("/").pop().split("?")[0];
        await storage.deleteFile(BUCKET_ID, imageId);
      }

      setBlogs((prev) => prev.filter((b) => b.$id !== blog.$id));
      toast.success("Blog deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete blog");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven’t written any blogs yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.$id}
              className="bg-white hover:bg-gray-100 rounded-xl shadow-sm overflow-hidden flex items-center transition group"
            >
              <Link
                to={`/blog/${blog.$id}`}
                className="flex flex-1 items-center no-underline text-gray-900"
              >
                {/* Image */}
                <img
                  src={blog.imageUrl || DefaultImage}
                  alt={blog.title}
                  className="w-40 h-28 object-cover sm:rounded-l-xl"
                />

                {/* Content */}
                <div className="flex-1 px-4 py-3 flex flex-col justify-center">
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                    {blog.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <IoTimeOutline className="mr-1" />
                    {new Date(blog.$createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>

              {/* Delete button */}
              <div className="pr-5 pl-2 flex items-start pt-4">
                <button
                  onClick={() => handleDelete(blog)}
                  className="text-red-600 hover:text-red-700 transition"
                  title="Delete blog"
                >
                  <IoTrashOutline size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
