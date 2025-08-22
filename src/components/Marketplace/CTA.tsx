import { Button, Link } from "@heroui/react";

const CallToAction = () => {
    return (
        <div className="max-w-7xl mx-auto text-center pb-20">
            <div className="">
                <h2 className="text-4xl text-white font-bold mb-4">Tidak Menemukan Batik yang Anda Cari?</h2>
                <p className="mb-6 text-base text-gray-400">Bergabunglah dengan komunitas kami untuk meminta motif tertentu atau berdiskusi dengan pengguna lainnya.</p>
                <Button as={Link} href="/forum" className="text-base bg-white font-semibold" >
                    Jelajahi Komunitas
                </Button>
            </div>
        </div>
    );
}

export default CallToAction;