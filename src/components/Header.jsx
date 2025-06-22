import React from 'react';

function Header({ view, setView }) {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">📝 Simple Blog App</h1>
      <nav className="space-x-4">
        <button
          onClick={() => setView("home")}
          className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
            view === "home"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
          }`}
        >
          All Blogs
        </button>
        <button
          onClick={() => setView("create")}
          className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
            view === "create"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
          }`}
        >
          Create Blog
        </button>
      </nav>
    </header>
  );
}

export default Header;
