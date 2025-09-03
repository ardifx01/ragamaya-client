import { IconCashBanknote } from "@tabler/icons-react";
import { Check, MonitorCog, NotepadText } from "lucide-react";

const PaymentProgressBar = ({ status }) => {
    let currentStep = 0

    switch (status) {
        case "generating ticket":
            currentStep = 2
            break;
        case "settlement":
            currentStep = 3
            break;
        default:
            currentStep = 0
    }

    return (
        <div>
            <div className='w-full flex flex-row gap-2 items-center justify-center sm:pb-20'>
                <Step index={0} currentStep={currentStep} status={status} />
                <StepDivider index={1} currentStep={currentStep} status={status} />
                <Step index={1} currentStep={currentStep} status={status} />
                <StepDivider index={2} currentStep={currentStep} status={status} />
                <Step index={2} currentStep={currentStep} status={status} />
                <StepDivider index={3} currentStep={currentStep} status={status} />
                <Step index={3} currentStep={currentStep} status={status} />
            </div>
        </div>
    )
}

const Step = ({ index, currentStep, status }) => {
    const steps = [
        {
            title: "Pemesanan Dibuat",
            desc: "Pemesanan telah berhasil dibuat"
        },
        {
            title: "Pembayaran",
            desc: "Silakan melakukan pembayaran"
        },
        {
            title: "Pembayaran Diverifikasi",
            desc: "Pembayaran sedang dalam proses verifikasi"
        },
        {
            title: "Transaksi Berhasil",
            desc: "Transaksi telah berhasil dilakukan"
        },
    ];

    if (status === "expire") {
        steps[1].title = "Pembayaran"
        steps[1].desc = "Pembayaran telah kadaluarsa"
    }

    return (
        <div className={`relative rounded-full p-2 ${index <= currentStep ? "bg-amber-400" : (index == 1 && status == "expire") ? "bg-rose-500" : index == currentStep + 1 ? "border-2 border-amber-500" : "border-2 border-neutral-300"}`} >
            {
                index === 0 ?
                    (<NotepadText size={18} color={index <= currentStep ? "#000" : "#fff"} />)
                    :
                    index === 1 ?
                        (<IconCashBanknote size={18} color={index <= currentStep ? "#fff" : (index == 1 && status == "expire") ? "#fff" : "#fff"} />)
                        :
                        index === 2 ?
                            (<MonitorCog size={18} color={index <= currentStep ? "#fff" : "#fff"} />)
                            :
                            index === 3 &&
                            (<Check size={18} color={index <= currentStep ? "#fff" : "#fff"} />)
            }

            <div className={`absolute hidden sm:block top-10 ${index == 3 ? "right-0" : "left-0"}`}>
                <p className={`font-bold  text-sm whitespace-nowrap ${index == 3 ? "text-right" : "text-left"}`}>{steps[index].title}</p>
                <p className={`text-sm ${index == 3 ? "text-right" : "text-left"}`}>{steps[index].desc}</p>
            </div>
        </div>
    )
}

const StepDivider = ({ index, currentStep, status }) => {
    return (
        <div className={`h-1 w-full rounded-full ${index <= currentStep ? "bg-amber-400" : (index == 1 && status == "expire") ? "bg-gradient-to-r from-amber-400 to-rose-500" : index == currentStep + 1 ? "bg-gradient-to-r from-amber-400 to-neutral-300" : "bg-neutral-300"}`} />
    )
}

export default PaymentProgressBar