import { useState, useEffect } from 'react';
import { Menu, X, Feather } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/50 backdrop-blur-md border-b border-white/20 shadow-lg py-2'
            : 'bg-white/20 backdrop-blur-none border-b border-white/10 py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between text-blue-600 font-bold text-lg">
                {/* Logo & Brand */}
                <a
                    href="#hero"
                    className="flex items-center gap-2 group"
                    aria-label="BuletinVzan Home"
                >
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Feather className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />

                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600/90 to-purple-600/90 font-bold text-xl tracking-tight">
                        BuletinVzan
                    </span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { name: 'Beranda', href: '#hero' },
                        { name: 'Tulis', href: '#tulis' },
                        { name: 'FAQ', href: '#faq' },
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-black/90 hover:text-purple hover:bg-white/10 transition-colors duration-200"
                        >
                            {item.name}
                        </a>
                    ))}
                    <a
                        href="#daftar"
                        className="ml-2 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg font-semibold bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group backdrop-blur-sm"
                    >
                        <svg
                            className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                        </svg>
                        <span className="hidden sm:inline">Daftar Beta</span>
                    </a>

                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-black" />
                    ) : (
                        <Menu className="w-6 h-6 text-black" />
                    )}
                </button>
            </div>

            {/* Mobile Nav Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-5 pt-2 pb-6 flex flex-col gap-1 bg-white/10 backdrop-blur-sm border-t border-white/10">
                    {[
                        { name: 'Beranda', href: '#hero' },
                        { name: 'Tulis', href: '#tulis' },
                        { name: 'FAQ', href: '#faq' },
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="px-4 py-3 rounded-lg text-base font-medium text-black/90 hover:text-black hover:bg-white/10 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </a>
                    ))}
                    <a
                        href="#daftar"
                        className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                        </svg>
                        Daftar Beta Tester
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;