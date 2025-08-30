import Hero from "@/components/LandingPage/Hero";
import LightRays from "@/components/ui/lightrays";
import Fitur from "@/components/LandingPage/Fitur";
import CTA from "@/components/LandingPage/CTA";

export default function NavbarDemo() {
  return (
    <div>

      <div style={{ width: '100%', height: '900px', position: 'absolute' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#6B6B6BFF"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={4}
          followMouse={true}
          mouseInfluence={0.1}
          className="custom-rays top-0"
        />
      </div>

      <Hero />

      <Fitur />

      <CTA />

      <div className="h-screen">
        <h1></h1>
      </div>
    </div>
  );
}