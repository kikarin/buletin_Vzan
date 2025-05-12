import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import HeroBackground from '../components/HeroBackground';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://app.buletin.co/images/landing/bg-blur.avif"
          width="1850"
          height="1691"
          alt=""
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-[1200px] sm:min-w-[1400px] xl:min-w-[1850px] h-fit"
        />
      </div>
      <div className="absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      {/* Content */}
      <div className="z-20 w-full max-w-xl space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
          >
            <Home className="w-5 h-5" />
            Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 