import React from 'react';
import Sidebar from "@/components/ui/sidebar/Sidebar";
import ProductTable from "@/components/Dashboard/product/ProductTable";

const DashboardProduct = () => {
    return (
        <div>
            <Sidebar activeLink="Produk">
                <ProductTable />
            </Sidebar>
        </div>
    );
};

export default DashboardProduct;
