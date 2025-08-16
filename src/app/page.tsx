"use client"


import Hero from "@/components/LandingPage/Hero";
import LightRays from "@/components/ui/lightrays";

export default function NavbarDemo() {
  return (
    <div>

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

      <Hero />

      <div className="relative h-screen bg-gradient-to-b from-transparent to-blue-900/20 flex items-center justify-center">

        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Features Section</h2>
        </div>
      </div>
    </div>
  );
}