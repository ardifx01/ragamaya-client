import { Button, Link } from "@heroui/react";

const CallToAction = () => {
    return (
        <div className="max-w-7xl mx-auto text-center mt-12">
            <div className="">
                <h2 className="text-3xl md:text-4xl text-white font-bold mb-4 ">Tidak Menemukan Batik yang Anda Cari?</h2>
                <p className="mb-6 text-sm md:text-base text-gray-400">Bergabunglah dengan komunitas kami untuk meminta motif tertentu atau berdiskusi dengan pengguna lainnya.</p>
                <Button as={Link} href="/forum" className="px-7 text-md py-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold border border-white/20 hover:border-white/40 transition-all duration-300" >
                    Jelajahi Komunitas
                </Button>
            </div>
        </div>
    );
}

export default CallToAction;