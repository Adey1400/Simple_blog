import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header className="bg-white shadow-md px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
        📝 Simple Blog App
      </h1>

      <nav className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-end">
        <Link
          to="/"
          className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
            location.pathname === '/'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Blogs
        </Link>

        <Link
          to="/create"
          className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
            location.pathname === '/create'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Create Blog
        </Link>
      </nav>
    </header>
  );
}

export default Header;
