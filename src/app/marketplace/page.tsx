"use client"

import CallToAction from "@/components/Marketplace/CTA";
import Header from "@/components/Marketplace/Header";
import Product from "@/components/Marketplace/Product";

const Marketplace = () => {
    return (
        <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900">
            <Header />
            <Product />
            <CallToAction />
        </div>
    )
}

export default Marketplace;