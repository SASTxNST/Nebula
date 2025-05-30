import React from "react";
import NebulaHero from "../pages/NebulaHero";
import AboutUs from "../components/AboutUs";

const NebulaHeroPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <NebulaHero />
      <AboutUs />
    </div>
  );
};

export default NebulaHeroPage;
