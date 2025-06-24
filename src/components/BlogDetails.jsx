import React from "react";

function BlogDetails({ blog, setView }) {
  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md text-center">
        <p className="text-gray-500 text-lg">❌ Blog Not Found</p>
        <button
          onClick={() => setView("home")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{blog.title}</h2>
      <p className="text-sm text-gray-500 italic">
        🕒 {new Date(blog.createdAt).toLocaleString()}
      </p>
      <div
        className="text-gray-700 leading-relaxed prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
      <div className="text-right">
        <button
          onClick={() => setView("home")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          ⬅ Back to Home
        </button>
        <button
          onClick={() => setView("edit")}
          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium mr-4"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
}

export default BlogDetails;
