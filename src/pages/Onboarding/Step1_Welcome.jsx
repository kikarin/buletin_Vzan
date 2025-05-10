import { useNavigate } from 'react-router-dom';
import HeroBackground from '../../components/HeroBackground';

function Step1_Welcome() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboarding/2');
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden px-4 py-12">
      {/* Background Blur Image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://app.buletin.co/images/landing/bg-blur.avif"
          width="1850"
          height="1691"
          alt=""
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-[1200px] sm:min-w-[1400px] xl:min-w-[1850px] h-fit"
        />
      </div>

      {/* Hero Background */}
      <div className="absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      {/* Content */}
      <div className="z-20 max-w-lg w-full text-center space-y-6 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl">
        <p className="text-sm text-blue-600 font-semibold tracking-wide uppercase">
          Langkah 1 dari 4
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
          Selamat Datang di <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            BuletinVzan
          </span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          Kami bantu kamu membangun buletin digital yang menarik, terpercaya, dan punya pembaca setia. Yuk mulai dari sini.
        </p>
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:scale-[1.04] transition shadow-lg"
        >
          Mulai Sekarang
        </button>
      </div>
    </div>
  );
}

export default Step1_Welcome;
