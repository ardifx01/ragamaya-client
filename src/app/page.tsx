"use client"

import MainNavbar from "@/components/Navbar";
import LightRays from "@/components/ui/lightrays";
import { Button, Image } from "@heroui/react";
import { CameraIcon } from "@phosphor-icons/react";

export default function NavbarDemo() {

  return (

    <div className="relative min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900">
      <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="##b0c6d6"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      <MainNavbar />

      <div className="flex items-center justify-center px-4 pt-52">
        <div className="text-center">
          <h1 className="mb-6 text-6xl font-bold text-white leading-10">
            Temukan Keindahan Budaya Batik
          </h1>
          <h1 className="mb-6 text-6xl font-bold text-white">Indonesia</h1>
          <p className="mb-8 text-xl text-gray-300 max-w-2xl mx-auto">
            Jelajahi pola batik tradisional dengan pengenalan AI, belanja desain digital, dan pelajari warisan budaya batik Indonesia.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button className="font-bold text-white bg-black border">
              <CameraIcon size={20} />
              Coba Pengenalan AI
            </Button>
            <Button className="font-bold">
              Jelajahi Marketplace
            </Button>
          </div>
        </div>
      </div>

      <div className="relative h-screen bg-gradient-to-b from-transparent to-blue-900/20 flex items-center justify-center">

        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Features Section</h2>
        </div>
      </div>
    </div>
  );
}