import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import EditBlog from "./components/EditBlog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PrivateRoutes } from "./utils/PrivatesRoutes";
import { AuthProvider } from "./utils/AuthContext";

function App() {
  const [blogs, setBlogs] = useState(() => {
    const stored = localStorage.getItem("blogs");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const addBlog = (newBlog) => {
    setBlogs((prev) => [newBlog, ...prev]);
  };

  const updateBlog = (updatedBlog) => {
    setBlogs((prev) =>
      prev.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const deleteBlog = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  return (
    <AuthProvider> {/* ✅ wrap everything inside this */}
      <Router>
        <Header />
        <main className="min-h-screen">
          <Routes>
            {/* Blog Routes (protected) */}
            <Route element={<PrivateRoutes />}>
              <Route
                path="/"
                element={<BlogList blogs={blogs} onDelete={deleteBlog} />}
              />
              <Route path="/create" element={<BlogForm addBlog={addBlog} />} />
              <Route path="/blog/:id" element={<BlogDetails blogs={blogs} />} />
              <Route
                path="/edit/:id"
                element={<EditBlog blogs={blogs} updateBlog={updateBlog} />}
              />
            </Route>

            {/* Auth Routes (public) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
