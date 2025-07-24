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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyBlogs from "./pages/MyBlogs";
import Footer from "./components/Footer";
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
        <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>
        <main className="min-h-screen flex-1 overflow-y-auto mt-16 mb-16 px-4">
          <Routes>
            {/* Blog Routes (protected) */}
            <Route element={<PrivateRoutes />}>
              <Route
                path="/"
                element={<BlogList blogs={blogs} onDelete={deleteBlog} />}
              />
              <Route path="/create" element={<BlogForm addBlog={addBlog} />} />
              <Route path="/blog/:id" element={<BlogDetails blogs={blogs} />} />
              <Route path="/my-blogs" element={<MyBlogs />} />
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
         <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <Footer/>
      </Router>
    </AuthProvider>
  );
}

export default App;
