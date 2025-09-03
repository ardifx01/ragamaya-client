"use client"

import React from 'react';
import {Card, CardBody} from "@heroui/react";
import {useRouter} from "next/navigation";

const QuizPage = () => {
    const router = useRouter();

    React.useEffect(() => {
        router.push("/edukasi");
    }, [])
    return (
        <div className="min-h-screen text-white p-4 flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-sky-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:4000ms]"></div>

            <main className="w-full flex justify-center z-10">
                <Card className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 text-white w-full max-w-2xl">
                    <CardBody className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <div className="text-lg">Redirecting...</div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
};

export default QuizPage;
