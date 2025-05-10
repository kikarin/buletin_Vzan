import { useEffect, useRef } from 'react';

const HeroBackground = () => {
  const containerRef = useRef(null);

  // Mouse parallax effect (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return; // Skip on mobile
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 50;
      const y = (e.clientY - innerHeight / 2) / 50;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const blobs = [
    {
      position: 'top-[-150px] left-[-150px]',
      size: 'w-[500px] h-[500px]',
      gradient: 'from-blue-500 to-purple-400',
      blur: 'blur-[160px]',
      opacity: 'opacity-40',
      delay: '',
    },
    {
      position: 'bottom-[-120px] right-[-120px]',
      size: 'w-[450px] h-[450px]',
      gradient: 'from-purple-500 to-blue-400',
      blur: 'blur-[140px]',
      opacity: 'opacity-50',
      delay: 'animation-delay-2000',
    },
    {
      position: 'top-[10%] right-[8%]',
      size: 'w-[350px] h-[350px]',
      gradient: 'from-purple-300 to-blue-300',
      blur: 'blur-[110px]',
      opacity: 'opacity-35',
      delay: 'animation-delay-4000',
    },
    {
      position: 'bottom-[20%] left-[25%]',
      size: 'w-[250px] h-[250px]',
      gradient: 'from-blue-200 to-purple-200',
      blur: 'blur-[100px]',
      opacity: 'opacity-25',
      delay: 'animation-delay-6000',
    },
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-t from-[#cfd9df] to-[#e2ebf0] opacity-70 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="transition-transform duration-100">

        {/* Base radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-white/70 via-blue-50 to-purple-100 opacity-70" />

        {/* Animated blobs */}
        {blobs.map((blob, i) => (
          <div
            key={i}
            className={`absolute ${blob.position} ${blob.size} bg-gradient-to-tr ${blob.gradient} rounded-full ${blob.blur} ${blob.opacity} animate-blob ${blob.delay} max-w-full`}
          />
        ))}

        {/* Central pulse aura */}
        <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-white/50 rounded-full blur-[120px] opacity-20 animate-pulse" />

        {/* Light rays */}
        <div className="absolute left-1/2 top-[15%] w-[400px] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[15deg] blur-sm opacity-20 animate-pulse" />
        <div className="absolute right-[25%] bottom-[20%] w-[300px] h-[2px] bg-gradient-to-r from-transparent via-white/15 to-transparent rotate-[-20deg] blur-sm opacity-20 animate-pulse" />

        {/* Sparkle stars */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full blur-[1px] opacity-60 animate-ping"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Ambient shimmer overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_80%)] animate-pulse" />
      </div>
    </div>
  );
};

export default HeroBackground;
