import React from 'react';
import DeleteButton from './DeleteBlog';
import { Link } from 'react-router-dom';
function BlogList({ blogs, onBlogClick, onDelete }) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6 px-4 sm:px-6 md:px-8 bg-white p-4 sm:p-6 rounded-xl shadow-md">
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center sm:text-left">
    📚 All Blogs
  </h2>

  {blogs.length === 0 ? (
    <p className="text-gray-500 italic text-center">No blog posted yet.</p>
  ) : (
    <ul className="space-y-4">
      {blogs.map((blog) => (
        <li
          key={blog.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 hover:bg-white"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <Link
                  to={`/blog/${blog.id}`}
                  className="text-left flex-1 block"
                >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {blog.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Posted on {new Date(blog.createdAt).toLocaleString()}
              </p>
            </Link>

            <DeleteButton onDelete={() => onDelete(blog.id)} />
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  );
}

export default BlogList;
