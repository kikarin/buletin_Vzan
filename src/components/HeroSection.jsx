import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import AboutAnimation from '../assets/female-creative-artist-with-ideas.json';

const HeroSection = () => {
  const navigate = useNavigate();

  const initAOS = useCallback(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  useEffect(() => {
    initAOS();
  }, [initAOS]);

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center px-6 md:px-12">
      {/* Decorative Circle */}
      <div className="absolute top-[-140px] left-[5px] w-[200px] h-[250px] bg-gradient-to-tr from-blue-500 to-purple-500 opacity-30 rounded-full blur-3xl animate-pulse-slow z-0" />

      {/* Fancy Blob SVG */}
      <svg
        className="absolute -top-64 -right-60 w-[700px] h-[450px] opacity-30 z-1 blur-xl"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#9298f6"
          d="M48.1,-61.3C61.2,-52.2,69.5,-34.7,71.5,-17.6C73.5,-0.5,69.2,15.9,61.2,30.4C53.2,44.9,41.4,57.5,26.5,63.4C11.6,69.3,-6.4,68.5,-22.6,61.1C-38.9,53.6,-53.3,39.4,-60.2,22.6C-67.2,5.9,-66.7,-13.3,-58.9,-28.3C-51.2,-43.4,-36.3,-54.3,-20.3,-62.2C-4.3,-70.1,12.9,-75,29.6,-70.3C46.4,-65.5,63.2,-51.4,48.1,-61.3Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Content */}
      <div
        data-aos="fade-up"
        className="ml-1 relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-16 mt-24 md:mt-20"
      >
        {/* Left Text */}
        <div className="text-center md:text-left max-w-xl space-y-6">
          <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold leading-tight font-sans text-gray-800 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
              Tulis Karyamu,
            </span><br />
            Temukan Pembaca Setia
          </h1>

          <p className="text-gray-700 text-base sm:text-lg md:text-xl font-medium">
            Jadilah yang pertama mencoba dan bangun audiens berbayar <br className="hidden md:block" />
            yang benar-benar menghargai tulisanmu!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg rounded-full hover:scale-105 transition shadow-lg  font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                Gabung Sekarang <ArrowRight size={18} />
              </span>
            </button>
          </div>

          <div className="text-sm text-gray-600 pt-2">
            <p>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">Gratis</span> hingga <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">1000 subscribers</span>. Biaya transaksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">10%</span> untuk <em>Paid Subscribers</em>.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div
          data-aos="zoom-in"
          className="relative w-full md:w-[50%] flex justify-center items-center"
        >
          <div className="relative w-[100%] md:w-full max-w-md md:max-w-full md:left-24">
            {/* Decorative Fancy Blob SVG Behind Image */}
            <svg
              className="absolute -top-28 md:-top-5 -left-[100px] w-[800px] h-[800px] opacity-40 blur-xl -z-10 animate-float"
              viewBox="0 0 600 600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#blobGradient)"
                d="M420,320Q400,390,330,410Q260,430,200,390Q140,350,140,280Q140,210,200,170Q260,130,330,150Q400,170,420,240Q440,310,420,320Z"
                transform="translate(-80 -80)"
              />
              <defs>
                <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="30%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>


            {/* Main Image */}
            <img src="https://app.buletin.co/images/landing/bg-blur.avif" width="1850" height="1691" alt=""
              class="absolute xl:-mt-56 top-1/2 -translate-y-1/2 xl:min-w-[1050px] h-fit sm:min-w-[1200px] min-w-[800px] left-1/2 -translate-x-1/2" />

            <Lottie
              animationData={AboutAnimation}
              loop={true}
              className="object-contain w-[100%] mx-auto h-auto transform hover:scale-105 hover:rotate-1 transition duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
