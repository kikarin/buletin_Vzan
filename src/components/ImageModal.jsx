import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function ImageModal({ isOpen, onClose, imageUrl, altText }) {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-8 h-8" />
        </button>
        
        <img
          src={imageUrl}
          alt={altText}
          className="max-h-[90vh] w-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
}

export default ImageModal; 