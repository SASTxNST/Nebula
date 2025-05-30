import React from "react";

const clientLogos = [
  { name: "genpact", src: "/genpact.svg" },
  { name: "lidl", src: "/lidl.svg" },
  { name: "capgemini", src: "/capgemini.svg" },
  { name: "cars24", src: "/cars24.svg" },
  { name: "nowcom", src: "/nowcom.svg" },
];

const AboutUs: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#23243a] to-[#181929]">
      {/* Glow background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_60%_60%,rgba(91,91,255,0.2)_0%,transparent_70%)]"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center text-center mt-20">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Build links that grow reach,
          <br className="hidden md:block" />
          network and visibility
        </h1>
        <p className="text-[#b0b3c7] text-base md:text-lg mb-10 font-normal max-w-xl">
          We help you develop a creditable backlink profile by building
          contextual, dofollow links
          <br className="hidden md:block" />
          that will increase your site’s traffic and search engine rankings.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-10">
          {clientLogos.map((logo) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              className="h-8 opacity-80 grayscale hover:opacity-100 transition-opacity duration-200"
              style={{ filter: "brightness(0.7)" }}
            />
          ))}
        </div>
      </div>
      {/* Globe image at the bottom */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[60vw] max-w-[700px] z-0 pointer-events-none opacity-70">
        <img src="/globe.svg" alt="globe" className="w-full" />
      </div>
    </div>
  );
};

export default AboutUs;
