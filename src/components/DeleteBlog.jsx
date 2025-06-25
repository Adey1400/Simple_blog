import React from 'react';

function DeleteButton({ onDelete }) {
 const handleDelete =()=>{
     if (window.confirm("Are you sure you want to delete this blog?")) {
      onDelete();
    }
 }
  
  return (
    
   <button
  onClick={handleDelete}
  title="Delete"
  className="text-gray-500 dark:text-gray-400 hover:text-red-600 hover:scale-110 transform transition-all duration-200 cursor-pointer text-xl sm:text-2xl"
>
  🗑
</button>

  );
}

export default DeleteButton;
