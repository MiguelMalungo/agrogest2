import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={`${import.meta.env.BASE_URL || '/'}images/farm.mp4`}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-10" />
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-6 md:px-20">
        {/* Logo */}
        <div className="mb-8 w-full flex justify-center">
          <img 
            src={`${import.meta.env.BASE_URL || '/'}logo.png`} 
            alt="AgroGest Logo" 
            className="h-20 md:h-28 w-auto object-contain"
          />
        </div>
        <h1 className="text-white text-5xl md:text-8xl lg:text-[8rem] font-extrabold text-left drop-shadow-lg tracking-wide leading-tight max-w-full md:max-w-3xl">
          O SEU GESTOR AGRÍCOLA
        </h1>
        <div className="w-full md:w-auto">
          <button
            onClick={() => window.location.href = '/hoje'}
            className="mt-10 px-8 py-4 md:px-12 md:py-6 bg-[#F5A926] text-white text-2xl md:text-4xl font-bold rounded-full shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#F5A926]/50 focus:ring-offset-2 w-auto max-w-full hover:bg-white hover:text-black whitespace-nowrap"
            aria-label="Entrar no gestor agrícola"
          >
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
