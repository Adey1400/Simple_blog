import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import EditBlog from "./components/EditBlog";

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
    <Router>
      <Header />
      <main className="min-h-screen">
        {blogs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Loading blogs...</p>
        )}

        <Routes>
          <Route
            path="/"
            element={<BlogList blogs={blogs} onDelete={deleteBlog} />}
          />
          <Route path="/create" element={<BlogForm addBlog={addBlog} />} />
          <Route
            path="/blog/:id"
            element={<BlogDetails blogs={blogs} />}
          />
          <Route
            path="/edit/:id"
            element={<EditBlog blogs={blogs} updateBlog={updateBlog} />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
