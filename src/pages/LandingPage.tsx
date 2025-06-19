import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={`${import.meta.env.BASE_URL}images/farm.mp4`}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-10" />
      {/* Main Title */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-white text-4xl md:text-7xl font-extrabold text-center drop-shadow-lg tracking-wide">
          O SEU GESTOR AGRÍCOLA
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;
