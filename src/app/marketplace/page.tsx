"use client"

import Header from "@/components/Marketplace/header";
import Product from "@/components/Marketplace/product";

const Marketplace = () => {
    return (
        <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900">
            <Header/>
            <Product/>
        </div>
    )
}

export default Marketplace;