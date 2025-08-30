import React from 'react';
import Sidebar from "@/components/ui/sidebar/Sidebar";
import WalletPage from "@/components/Dashboard/wallet/WalletPage";

const DashboardWallet = () => {
    return (
        <div>
            <Sidebar activeLink="Dompet">
                <WalletPage />
            </Sidebar>
        </div>
    );
};

export default DashboardWallet;
