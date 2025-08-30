import React from 'react';
import Sidebar from "@/components/ui/sidebar/Sidebar";
import TransactionTable from "@/components/Dashboard/transaction/TransactionTable";

const DashboardTransaction = () => {
    return (
        <div>
            <Sidebar activeLink="Transaksi">
                <TransactionTable />
            </Sidebar>
        </div>
    );
};

export default DashboardTransaction;
