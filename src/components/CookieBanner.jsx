import { Cookie } from 'lucide-react';

const CookieBanner = ({ show, onAccept, onReject }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 font-sans">
      <div className="ml-auto max-w-xs sm:max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-4 flex flex-col gap-3 text-[11px] sm:text-xs text-gray-700 animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center gap-2 font-semibold text-blue-700">
          <Cookie className="w-4 h-4" />
          <span>Privasi Anda Penting</span>
        </div>

        {/* Description */}
        <p className="text-[10px] sm:text-xs text-gray-600 leading-snug">
          Kami menggunakan cookies untuk menjalankan situs dan meningkatkan pengalaman Anda.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={onAccept}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold transition"
          >
            Terima
          </button>
          <button
            onClick={onReject}
            className="bg-white hover:bg-slate-50 ring-1 ring-slate-300 text-gray-700 px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold transition"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
