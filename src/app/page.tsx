import Hero from "@/components/LandingPage/Hero";
import LightRays from "@/components/ui/lightrays";
import Fitur from "@/components/LandingPage/Fitur";
import CTA from "@/components/LandingPage/CTA";
import FiturUnggulan from "@/components/LandingPage/FiturUnggulan";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#6B6B6BFF"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={4}
          followMouse={true}
          mouseInfluence={0.1}
          className="custom-rays"
        />
      </div>

      <Hero />

      <div className="relative">
        <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <Fitur />

      <FiturUnggulan />

      <CTA />
    </div>
  );
}