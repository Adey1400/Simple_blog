import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { migrateAuthorNames ,checkMigrationNeeded } from '../pages/migrateAuthorNames';
import { toast } from 'react-toastify';
function Header() {
  const location = useLocation();
    const [migrating, setMigrating] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();



   const handleMigrateAuthors = async () => {
    try {
      setMigrating(true);
      
      // First check if migration is needed
      const status = await checkMigrationNeeded();
      
      if (!status.needsMigration) {
        toast.info("All blogs already have proper author names!");
        return;
      }

      // Proceed with migration
      const result = await migrateAuthorNames();
      
      if (result.updatedCount > 0) {
        toast.success(`Successfully updated ${result.updatedCount} blog(s) with author names!`);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.info("No blogs needed author name updates.");
      }
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Failed to update author names. Please try again.");
    } finally {
      setMigrating(false);
    }
  };

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
  <header className="bg-white shadow-md border-b border-gray-200 px-4 sm:px-6 py-4">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
      📝 Simple Blog App
    </h1>

    {user && (
      <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
        <span className="text-sm text-gray-700 font-semibold sm:mr-2">
          👋 Hello, <span className="text-gray-900">{user.name}</span>
        </span>

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
   <button
          onClick={handleMigrateAuthors}
          disabled={migrating}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl text-xs font-medium transition"
          title="Fix missing author names in existing blogs"
        >
          {migrating ? "Fixing..." : "Fix Authors"}
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          Logout
        </button>
      </nav>
    )}
  </div>
</header>

  );
}

export default Header;
