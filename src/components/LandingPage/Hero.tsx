import { Button } from "@heroui/react"
import { CameraIcon } from "@phosphor-icons/react"

const Hero = () => {
    return(
        <div className="flex items-center justify-center px-4 pt-40 md:pt-52">
        <div className="text-center">
          <h1 className="md:mb-6 mb-4 md:text-6xl text-3xl font-bold text-white md:leading-20 leading-10">
            Temukan Keindahan Budaya Batik <span className="md:block inline">Indonesia</span>
          </h1>
          <p className="mb-8 md:text-xl text-sm text-gray-300 max-w-2xl mx-auto">
            Jelajahi pola batik tradisional dengan pengenalan berbasis AI, belanja desain digital, dan pelajari warisan budaya batik Indonesia.
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
    )
}

export default Hero;