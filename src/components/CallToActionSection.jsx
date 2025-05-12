import CallImage from '../assets/2.png';
import { useNavigate } from 'react-router-dom';


const CallToActionSection = () => {
    const navigate = useNavigate();
    return (
        <section id="daftar" className="relative z-[1]">
            {/* Content Container */}
            <div className="relative z-[2] max-w-7xl mx-auto px-6 md:px-12 py-20 text-center flex flex-col items-center gap-10">
                {/* Heading */}
                <div className="max-w-2xl space-y-4" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                        Siap Coba{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
                            BuletinVzan?
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Bangun audiens, dapatkan pembaca berbayar, dan kelola semuanya dengan mudah—
                        semua dalam satu platform!
                    </p>
                </div>

                {/* Button */}
                <button
                    onClick={() => navigate('/register')}
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    Daftar Beta Tester
                </button>

                {/* Benefit List */}
                <ul className="text-gray-500 text-sm space-y-1" data-aos="fade-up" data-aos-delay="100">
                    <li>Gratis hingga 1000 subscribers.</li>
                    <li>Biaya transaksi 10% untuk Paid Subscribers.</li>
                </ul>
            </div>

            {/* Call-to-action Image */}
            <img
                src={CallImage}
                alt="Buletin dashboard preview"
                className="relative z-[1] w-screen sm:w-screen md:w-full "
                data-aos="zoom-in"
                data-aos-delay="200"
            />

            {/* Fade to white (soft bottom layer) */}
            <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-b from-transparent to-white z-[1]" />

            {/* Blur BG Overlay */}
            <img
                src="https://app.buletin.co/images/landing/bg-blur.avif"
                alt=""
                className="absolute inset-0 w-full translate-y-20 max-sm:translate-y-1/4 max-sm:-translate-x-40 sm:min-w-[1200px] min-w-[800px] z-0 pointer-events-none"
            />
        </section>
    );
};

export default CallToActionSection;
