import { BookOpenText, Brain, MessageSquare, ShoppingBag} from "lucide-react";
import CardSwap, { Card } from "../ui/card-swap";
import { Image } from "@heroui/react";

const Fitur = () => {
    return (
        <div className="flex pt-52">
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
                            <Card className="overflow-hidden">
                                <div className="border-b-1 border-white flex items-center p-3 gap-2">
                                    <Brain color="white" />
                                    <h3 className="text-white font-bold">Deteksi Batik Berbasis AI</h3>
                                </div>
                                <Image
                                    src="/assets/fitur1.jpg"
                                    alt="Logo RagaMaya"
                                    width={600}
                                    height={350}
                                    className="p-4 rounded-lg"
                                />
                            </Card>
                            <Card className="overflow-hidden">
                                <div className="border-b-1 border-white flex items-center p-3 gap-2">
                                    <BookOpenText color="white" />
                                    <h3 className="text-white font-bold">Belajar Budaya Batik Indonesia</h3>
                                </div>
                                <Image
                                    src="/assets/fitur4.jpg"
                                    alt="Logo RagaMaya"
                                    width={600}
                                    height={350}
                                    className="p-4 rounded-lg"
                                />
                            </Card>
                            <Card className="overflow-hidden">
                                <div className="border-b-1 border-white flex items-center p-3 gap-2">
                                    <ShoppingBag color="white" />
                                    <h3 className="text-white font-bold">Marketplace Batik</h3>
                                </div>
                                <Image
                                    src="/assets/fitur3.jpg"
                                    alt="Logo RagaMaya"
                                    width={600}
                                    height={350}
                                    className="p-4 rounded-lg"
                                />
                            </Card>
                            <Card className="overflow-hidden">
                                <div className="border-b-1 border-white flex items-center p-3 gap-2">
                                    <MessageSquare color="white" />
                                    <h3 className="text-white font-bold">Forum Diskusi Mengenai Batik</h3>
                                </div>
                                <Image
                                    src="/assets/fitur2.jpg"
                                    alt="Logo RagaMaya"
                                    width={600}
                                    height={350}
                                    className="p-4 rounded-lg"
                                />
                            </Card>
                        </CardSwap>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fitur;