import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import BlogDetails from "./components/BlogDetails";
import { MdUpdate } from "react-icons/md";
import EditBlog from './components/EditBlog';
function App() {
  const [view, setView] = useState("home");
  const [blogs, setBlogs] = useState(() => {
    const storedBlogs = localStorage.getItem("blogs");
    return storedBlogs ? JSON.parse(storedBlogs) : [];
  });
  const [selectedBlog, setSelectedBlog] = useState(null);

  const addBlog = (newBlog) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setView("details");
  };

  const updateBlog = (updateBlog) => {
    setBlogs((prev) =>
      prev.map((blog) => (blog.id === updateBlog.id ? updateBlog : blog))
    );
    setSelectedBlog(null);
  };

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const deleteBlog = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    if (view === "details" && selectedBlog?.id === id) {
      setView("home");
    }
  };
  return (
    <>
      <Header view={view} setView={setView} />

      {view === "home" && (
        <BlogList
          blogs={blogs}
          onBlogClick={handleBlogClick}
          onDelete={deleteBlog}
        />
      )}

      {view === "create" && <BlogForm addBlog={addBlog} setView={setView} />}

      {view === "details" && (
        <BlogDetails blog={selectedBlog} setView={setView} />
      )}

      {view === "edit" && selectedBlog && (
        <EditBlog
          blog={selectedBlog}
          updateBlog={updateBlog}
          setView={setView}
        />
      )}
    </>
  );
}

export default App;
