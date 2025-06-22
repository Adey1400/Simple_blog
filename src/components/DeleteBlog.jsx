import React from 'react';

function DeleteButton({ onDelete }) {
  return (
    <button
      onClick={onDelete}
      title="Delete"
      className="text-gray-400 hover:text-red-500 hover:scale-125 transform transition-all duration-200 cursor-pointer"
    >
      🗑
    </button>
  );
}

export default DeleteButton;
