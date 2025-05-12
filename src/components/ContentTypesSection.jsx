import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const contentTypes = [
  {
    title: "Paid Post",
    desc: "Buat postingan eksklusif yang hanya bisa diakses oleh pembaca berbayar.",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 5.71v9.58c0 2.76-2.24 5-5 5H7c-.46 0-.9-.06-1.33-.18-.62-.17-.82-.96-.36-1.42L15.94 8.06c.22-.22.55-.27.86-.21.32.06.67-.03.92-.27L20.29 5c.94-.94 1.71-.63 1.71.71Z" />
        <path
          opacity=".4"
          d="M14.64 7.36 4.17 17.83c-.48.48-1.28.36-1.6-.24-.37-.68-.57-1.47-.57-2.3V5.71c0-1.34.77-1.65 1.71-.71l2.58 2.59c.39.38 1.03.38 1.42 0L11.29 4c.39-.39 1.03-.39 1.42 0l1.94 1.94c.38.39.38 1.03-.01 1.42Z"
        />
      </svg>
    ),
  },
  {
    title: "Update Terkini",
    desc: "Sampaikan berita terbaru dan cerita inspiratif langsung ke audiens.",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path
          opacity=".4"
          d="M19 9.5c-2.48 0-4.5-2.02-4.5-4.5 0-.72.19-1.39.49-2H7.52C4.07 3 2 5.06 2 8.52v7.95C2 19.94 4.07 22 7.52 22h7.95c3.46 0 5.52-2.06 5.52-5.52V9.01c-.6.3-1.27.49-1.99.49Z"
        />
        <path d="M11.75 14h-5a.75.75 0 1 1 0-1.5h5a.75.75 0 0 1 0 1.5ZM15.75 18h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5Z" />
      </svg>
    ),
  },
  {
    title: "Event Spesial",
    desc: "Adakan acara eksklusif dengan pendaftaran terbatas untuk anggota komunitas.",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3.672v16.66l-.8.91c-1.11 1.26-2.02.92-2.02-.76v-7.2H6.09c-1.4 0-1.79-.86-.86-1.91l6.77-7.7Z" />
        <path
          opacity=".4"
          d="M18.77 12.63 12 20.33V3.67l.8-.91c1.11-1.26 2.02-.92 2.02.76v7.2h3.09c1.4 0 1.79.86.86 1.91Z"
        />
      </svg>
    ),
  },
];

const ContentTypesSection = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  return (
    <section id="faq" className="relative z-[1] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 max-w-3xl mx-auto leading-tight">
          Apa Saja yang Bisa Dipublikasikan di{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
            BuletinVzan?
          </span>
        </h2>

        <div
          className="bg-blue-600 2xl:p-32 sm:p-20 p-10 grid xl:grid-cols-3 sm:grid-cols-2 sm:gap-32 gap-10 rounded-3xl bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage:
              "url('https://app.buletin.co/images/landing/use-pattern-bg.avif')",
          }}
        >
          {contentTypes.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start gap-4 text-white text-left transition transform hover:scale-[1.015]  duration-300 ease-in-out"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <span className="bg-white text-blue-600 p-4 rounded-full shadow-lg ring-2 ring-blue-200">
                {item.icon}
              </span>
              <h3 className="text-xl font-bold mt-2">{item.title}</h3>
              <p className="text-base leading-relaxed opacity-90">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentTypesSection;
