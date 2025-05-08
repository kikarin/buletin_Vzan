// src/components/LikeButton.jsx
import React from 'react';

function LikeButton({ liked, likeCount, onToggle }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        onClick={onToggle}
        className={`px-3 py-1 rounded text-white ${liked ? 'bg-red-500' : 'bg-gray-500'} hover:opacity-80`}
      >
        ❤️ {liked ? 'Liked' : 'Like'}
      </button>
      <span className="text-gray-700">{likeCount} likes</span>
    </div>
  );
}

export default LikeButton;
