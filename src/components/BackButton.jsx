import { ArrowLeft } from 'lucide-react';

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-blue-600 font-medium px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      Kembali
    </button>
  );
}

export default BackButton;
