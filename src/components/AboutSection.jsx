import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AboutImage from '../assets/2.png';
import { PenLine, Users, Send } from 'lucide-react';

const iconWrapper =
  'w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-300/30';

const features = [
  {
    title: 'Tulis & Dapatkan Pembaca Berbayar',
    icon: <PenLine className="w-24 h-7" />,
    desc:
      'Satu platform untuk semuanya—publikasikan ke website, kirim ke email & WhatsApp, dan kelola pembayaran dengan mudah.',
  },
  {
    title: 'Bangun Audiens yang Mendukung Karyamu',
    icon: <Users className="w-24 h-7" />,
    desc:
      'Terhubung langsung dengan pembaca, tanpa algoritma yang mengatur siapa yang melihat tulisanmu.',
  },
  {
    title: 'Menulis Tanpa Ribet, Langsung Terbit & Dinikmati',
    icon: <Send className="w-24 h-7" />,
    desc:
      'Tulis, terbitkan, bagikan, dan dapatkan bayaran. Sesederhana itu.',
  },
];

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  return (
    <section id="tulis" className="relative py-32 px-6 md:px-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-200 rounded-full blur-[160px] opacity-30 z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[120px] opacity-20 z-0"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Title */}
        <div className="text-center mb-20" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Tulis
          </h2>


          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Menulis harusnya gampang—cukup tuangkan ide tanpa ribet mikirin teknis. Editor yang simpel dan bebas distraksi bikin setiap kata mengalir lebih lancar.          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div data-aos="fade-right" className="text-center md:text-left relative">
            {/* First Image (Background Image) */}
            <img
              src="https://app.buletin.co/images/landing/bg-blur.avif"
              width="400"
              height="400"
              alt=""
              className="absolute xl:-mt-16 top-1/2 -translate-y-1/2 xl:min-w-[1050px] h-auto sm:min-w-[1000px] min-w-[500px] left-48 -translate-x-1/2 z-0"
            />

            {/* About Image (This should appear above the first image) */}
            <img
              src={AboutImage}
              alt="About Buletin"
              className="relative w-full max-w-md mx-auto md:mx-0 rounded-3xl shadow-inherit ring-1 ring-blue-100 z-10"
            />
          </div>

          {/* Text Features */}
          <div data-aos="fade-left" className="space-y-12 text-gray-800 text-lg leading-relaxed">
            {features.map((item, idx) => (
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-500 text-white shadow-lg shadow-blue-400/30">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {item.desc}
                  </p>
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
