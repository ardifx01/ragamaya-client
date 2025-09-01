'use client'

import Header from "@/components/PaymentHistory/Header"
import { PaymentStatusType } from "@/types/payment_history_type";
import React, { useState } from "react";

const PaymentHistoryPage = () => {
    const [statusType, setStatusType] = useState<PaymentStatusType>(PaymentStatusType.All);

    return (
        <div>
            <Header
                Status={statusType}
                onStatusChange={setStatusType}
            />
        </div>
    )
}

export default PaymentHistoryPage