import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
function BlogForm({ addBlog, setView }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const editorRef= useRef(null)
  const handleSubmit = (e) => {
    e.preventDefault();
    const HTMLcontent= editorRef.current.getContent();
    const plainText = editorRef.current.getContent({ format: 'text' });
    try {
      if (!title.trim() || !plainText.trim()) {
        throw new Error('Title and content are required');
      }
      const newBlog = {
        id: Date.now(),
        title,
        content: HTMLcontent,
        createdAt: new Date().toISOString(),
      };
      addBlog(newBlog);
      setTitle('');
      editorRef.current.setContent('');
      setError('');
      setView('home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md space-y-6"
    >
     
      <h2 className="text-2xl font-semibold text-gray-800">📝 Create New Blog</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter blog title"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
        <Editor
          apiKey='im4gdwalk404a2x1as3j7oqqz47g3es0napw2on3bgqi3hku'
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | bold italic underline | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | link image | removeformat',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Add Blog
        </button>
      </div>
    </form>
  );
}

export default BlogForm;
