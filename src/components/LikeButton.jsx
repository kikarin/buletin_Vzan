import React, { useState, useEffect } from 'react';
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons';

function LikeButton({ liked, likeCount, onToggle }) {
  const [localLiked, setLocalLiked] = useState(liked);
  const [localCount, setLocalCount] = useState(likeCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setLocalLiked(liked);
    setLocalCount(likeCount);
  }, [liked, likeCount]);

  const handleClick = () => {
    const newLiked = !localLiked;
    const countChange = newLiked ? 1 : -1;

    setLocalLiked(newLiked);
    setLocalCount(prev => prev + countChange);
    setIsAnimating(true);

    onToggle();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${localLiked
            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        aria-label={localLiked ? 'Unlike' : 'Like'}
      >
        <div className="relative">
          {localLiked ? (
            <HeartFilledIcon className={`w-5 h-5 ${isAnimating ? 'animate-ping-once' : ''}`} />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-rose-400 rounded-full"
                  style={{
                    transform: `rotate(${i * 60}deg) translateY(-8px)`,
                    opacity: 0,
                    animation: `sparkle 1s ease-out ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <span className="text-sm font-medium">
          {localLiked ? 'Sukai' : 'Suka'}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${localLiked ? 'bg-rose-200 text-rose-700' : 'bg-gray-200 text-gray-700'
          }`}>
          {localCount}
        </span>
      </button>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0% { transform: rotate(0) translateY(-8px) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(0) translateY(-20px) scale(1.5); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LikeButton;