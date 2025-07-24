import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { User, Menu, X } from 'lucide-react';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Hide Header on Login/Register pages
  const hideOnAuthPages =
    location.pathname === "/login" || location.pathname === "/register";
  if (hideOnAuthPages) return null;

  console.log("User from context:", user);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 relative" ref={menuRef}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800">
          📝 SereneScribe
        </h1>

        {user && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <nav className="flex items-center gap-3">
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                    location.pathname === '/'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Blogs
                </Link>
                <Link
                  to="/create"
                  className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                    location.pathname === '/create'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Create Blog
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </div>
                <nav className="py-2">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === '/'
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    📄 All Blogs
                  </Link>
                  <Link
                    to="/create"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === '/create'
                        ? 'bg-green-50 text-green-600 border-r-2 border-green-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ✏️ Create Blog
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;