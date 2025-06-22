import React from 'react';
import DeleteButton from './DeleteBlog';

function BlogList({ blogs, onBlogClick, onDelete }) {
  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 All Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500 italic">No blog posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow"
            >
              {/* Flex container for content + delete button */}
              <div className="flex justify-between items-start gap-4">
                <button
                  type="button"
                  onClick={() => onBlogClick(blog)}
                  className="text-left flex-1"
                >
                  <h3 className="text-lg font-bold text-gray-900">{blog.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted on {new Date(blog.createdAt).toLocaleString()}
                  </p>
                </button>

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
