"use client"

import Hero from "@/components/LandingPage/Hero";
import LightRays from "@/components/ui/lightrays";
import SmoothScroll from "@/components/SmoothScroll";
import Fitur from "@/components/LandingPage/Fitur";

export default function NavbarDemo() {
  return (
    <SmoothScroll>
      <div style={{ width: '100%', height: '900px', position: 'absolute' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#b0c6d6"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays top-0"
        />
      </div>

      <div className="hero-section" data-speed="0.8">
        <Hero />
      </div>

      <Fitur />

      <div className="h-screen">
        <h1></h1>
      </div>

    </SmoothScroll>
  );
}