import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function DropdownPortal({ children, top, left, onClose }) {
  const ref = useRef();
  const [pos, setPos] = useState({ top, left });

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      let newLeft = left;
      if (rect.right > viewportWidth - 8) {
        newLeft = Math.max(viewportWidth - rect.width - 8, 8);
      }
      setPos({ top, left: newLeft });
    }
  }, [top, left, children]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        return;
      }
      if (onClose) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: pos.top + -70, 
        left: pos.left + -25, 
        zIndex: 99999,
        minWidth: 220,
        maxWidth: 420,
        marginlefft: '90%', 
      }}
      className="bg-white border-2 border-blue-200 rounded-2xl shadow-2xl ring-1 ring-blue-100 overflow-hidden text-sm animate-fade-in-up"
    >
      {children}
    </div>,
    document.body
  )
    ;
}

export default DropdownPortal; 