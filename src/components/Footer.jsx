import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Logo from '../assets/logo-t.png';

const Footer = () => {
  return (
    <footer className="bg-white py-20 text-sm relative z-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid xl:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-12 px-6">
        {/* Brand */}
        <div className="flex flex-col gap-8 xl:col-span-2 max-xl:order-last">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Buletin Logo"
                className="w-6 h-6 sm:w-10 sm:h-10 object-contain" />
              <h5 className="font-bold text-lg ml-2 text-gray-800">BuletinVzan</h5>
            </div>
            <p className="text-slate-600">Publikasi Berbayar, Tanpa Ribet.</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[Linkedin, Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" target="_blank" rel="noopener noreferrer">
                <Icon className="w-6 h-6 text-blue-600 hover:text-purple-600 transition-colors duration-200" />
              </a>
            ))}
          </div>

          {/* Bottom links */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-slate-600 text-xs pt-2">
            <span>© {new Date().getFullYear()} Buletin.co</span>
            <div className="flex gap-2 items-center flex-wrap">
              {['Help', 'Privacy', 'Terms', 'Refund'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i !== 0 && <span className="w-1 h-1 bg-slate-500 rounded-full" />}
                  <a href="#" className="underline hover:text-blue-600 transition">{item}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="flex flex-col gap-4">
          <h4 className="uppercase font-bold text-sm text-gray-800">About</h4>
          <ul className="text-slate-600 flex flex-col gap-2">
            <li><a href="#hero" className="hover:text-blue-600 transition">Beranda</a></li>
            <li><a href="#tulis" className="hover:text-blue-600 transition">Tulis</a></li>
            <li><a href="#faq" className="hover:text-blue-600 transition">FAQ</a></li>
          </ul>
        </div>

        {/* Headquarter */}
        <div className="flex flex-col gap-4">
          <h4 className="uppercase font-bold text-sm text-gray-800">Headquarter</h4>
          <address className="text-slate-600 not-italic leading-relaxed text-sm">
            PT. ZanStein Solution<br />
            Baranang Siang Indah<br />
            Jl. Mega-mendung 2<br />
            Kota Bogor, Jawa Barat – Indonesia<br />
            Phone: (+62) 856-9353-1495
          </address>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="uppercase font-bold text-sm text-gray-800">Contact Us</h4>
          <div className="text-slate-600 space-y-1 text-sm">
            <p>Email: <a href="mailto:milhampauzan@gmail.com" className="underline hover:text-blue-600 transition">milhampauzan@gmail.com</a></p>
            <p>WhatsApp: +62 856-9353-1495</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
