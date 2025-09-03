'use client'

import Header from "@/components/PaymentHistory/Header"
import Payments from "@/components/PaymentHistory/Payment";
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
            <Payments
                StatusType={statusType}
            />
        </div>
    )
}

export default PaymentHistoryPage