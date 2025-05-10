// src/pages/Landing.jsx
import { useEffect, useState } from 'react';
import NavbarSection from '../components/NavbarSection';
import HeroSection from '../components/HeroSection';
import HeroBackground from '../components/HeroBackground';
import AboutSection from '../components/AboutSection';
import ContentTypesSection from '../components/ContentTypesSection';
import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';

function Landing() {
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('acceptCookies');
    setShowCookies(!accepted);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('acceptCookies', 'true');
    setShowCookies(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('acceptCookies', 'rejected');
    setShowCookies(false);
  };

  return (
    <div className="font-sans relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <NavbarSection />
      {/* Global Background */}
      <div className="absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      {/* Page Content */}
      <HeroSection />
      <AboutSection />
      <ContentTypesSection />
      <CallToActionSection />
      <Footer />
      <CookieBanner
        show={showCookies}
        onAccept={handleAcceptCookies}
        onReject={handleRejectCookies}
      />
    </div>

  );
}

export default Landing;
