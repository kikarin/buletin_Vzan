import React, { useState, useEffect } from 'react';
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';

function BookmarkButton({ bookmarked, onToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  const handleClick = () => {
    setIsBookmarked(!isBookmarked);
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isBookmarked
          ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <div className="relative">
        {isBookmarked ? (
          <BookmarkFilledIcon className={`w-5 h-5 ${isAnimating ? 'animate-bounce-once' : ''}`} />
        ) : (
          <BookmarkIcon className="w-5 h-5" />
        )}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                style={{
                  transform: `rotate(${i * 90}deg) translateY(-8px)`,
                  opacity: 0,
                  animation: `sparkle 0.6s ease-out ${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <span className="text-sm font-medium whitespace-nowrap">
        {isBookmarked ? 'Tersimpan' : 'Simpan'}
      </span>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sparkle {
          0% { transform: rotate(0) translateY(-8px) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(0) translateY(-15px) scale(1.2); opacity: 0; }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </button>
  );
}

export default BookmarkButton;