// src/components/BookmarkButton.jsx
import React from 'react';

function BookmarkButton({ bookmarked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`mt-2 px-3 py-1 rounded text-white ${bookmarked ? 'bg-green-600' : 'bg-gray-500'} hover:opacity-80`}
    >
      📌 {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}

export default BookmarkButton;
