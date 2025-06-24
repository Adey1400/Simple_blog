import React from 'react';

function DeleteButton({ onDelete }) {
  return (
   <button
  onClick={onDelete}
  title="Delete"
  className="text-gray-500 dark:text-gray-400 hover:text-red-600 hover:scale-110 transform transition-all duration-200 cursor-pointer text-xl sm:text-2xl"
>
  🗑
</button>

  );
}

export default DeleteButton;
