import { BookOpenText, Brain, MessageSquare, ShoppingBag } from "lucide-react";
import CardSwap, { Card } from "../ui/card-swap";
import { Image } from "@heroui/react";

const Fitur = () => {
    const fiturData = [
        {
            id: 1,
            icon: Brain,
            title: "Deteksi Batik Berbasis AI",
            image: "/assets/fitur1.jpg"
        },
        {
            id: 2,
            icon: BookOpenText,
            title: "Belajar Budaya Batik Indonesia",
            image: "/assets/fitur4.jpg"
        },
        {
            id: 3,
            icon: ShoppingBag,
            title: "Marketplace Batik",
            image: "/assets/fitur3.jpg"
        },
        {
            id: 4,
            icon: MessageSquare,
            title: "Forum Diskusi Mengenai Batik",
            image: "/assets/fitur2.jpg"
        }
    ];

    return (
        <div>
            <div className="flex pt-52 ">
                <div className="max-w-6xl w-full mx-auto">
                    <div className="flex items-center justify-between gap-8">
                        <div className="flex-1 space-y-5    ">
                            <h1 className="text-6xl font-bold text-white">
                                Fitur <span className="block">RagaMaya</span>
                            </h1>
                            <p className="text-gray-400 text-xl">Fitur-fitur yang ada pada RagaMaya</p>
                        </div>
                        <div className="flex-1" style={{ height: '400px', position: 'relative' }}>
                            <CardSwap
                                cardDistance={60}
                                verticalDistance={70}
                                delay={5000}
                                pauseOnHover={false}
                                easing="elastic"
                                width={"100%"}
                            >
                                {fiturData.map((fitur) => {
                                    const IconComponent = fitur.icon;
                                    return (
                                        <Card key={fitur.id} className="overflow-hidden">
                                            <div className="border-b-1 border-white flex items-center p-3 gap-2">
                                                <IconComponent color="white" />
                                                <h3 className="text-white font-bold">{fitur.title}</h3>
                                            </div>
                                            <Image
                                                src={fitur.image}
                                                alt="Logo RagaMaya"
                                                width={600}
                                                height={350}
                                                className="p-4 rounded-lg"
                                            />
                                        </Card>
                                    );
                                })}
                            </CardSwap>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fitur;