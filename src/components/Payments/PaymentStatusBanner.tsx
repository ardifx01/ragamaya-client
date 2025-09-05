import dynamic from 'next/dynamic'

const Player = dynamic(
    () => import('@lottiefiles/react-lottie-player').then(mod => ({ default: mod.Player })),
    { ssr: false }
)

const PaymentStatusBanner = ({ status }) => {
    if (status === "pending") {
        return (
            <div className={`bg-gradient-to-tl from-amber-500 to-amber-300 w-full pb-10 pt-20 flex flex-col items-center justify-center`}>
                <Player
                    src="/animations/card.json"
                    autoplay
                    loop
                    style={{ height: "250px", width: "px" }}
                />
                <div>
                    <p className='w-11/12 mx-auto text-center text-white text-2xl font-bold'>Menunggu Pembayaran</p>
                    <p className='w-11/12 mx-auto text-center text-white'>Silakan lakukan pembayaran sesuai dengan metode yang kamu pilih</p>
                </div>
            </div>
        )
    } else if (status === "generating ticket") {
        return (
            <div className={`bg-gradient-to-tl from-sky-600 to-sky-400 w-full pb-10 pt-20 flex flex-col items-center justify-center`}>
                <Player
                    src="/animations/ticket.json"
                    autoplay
                    loop
                    style={{ height: "250px", width: "700px" }}
                />
                <div>
                    <p className='w-11/12 mx-auto text-center text-white text-2xl font-bold'>Memproses Tiket</p>
                    <p className='w-11/12 mx-auto text-center text-white'>Pembayaran diterima! Tiket kamu sedang kami proses</p>
                </div>
            </div>
        )
    } else if (status === "expire") {
        return (
            <div className={`bg-gradient-to-tl from-rose-700 to-rose-500 w-full pb-10 pt-20 flex flex-col items-center justify-center`}>
                <Player
                    src="/animations/failed.json"
                    autoplay
                    loop
                    style={{ height: "250px", width: "700px" }}
                />
                <div>
                    <p className='w-11/12 mx-auto text-center text-white text-2xl font-bold'>Pembayaran Kadaluarsa</p>
                    <p className=' mx-auto text-center text-white'>Pembayaran telah kadaluarsa, pemesanan tiket dibatalkan</p>
                </div>
            </div>
        )
    } else if (status === "settlement") {
        return (
            <div className={`bg-gradient-to-tl from-blue-300 to-blue-400 w-full pb-10 pt-20 flex flex-col items-center justify-center`}>
                <Player
                    src="/animations/success.json"
                    autoplay
                    loop
                    style={{ height: "250px", width: "700px" }}
                />
                <div>
                    <p className='w-11/12 mx-auto text-center text-white text-2xl font-bold'>Transaksi Berhasil</p>
                    <p className='w-11/12 mx-auto text-center text-white'>Transaksi selesai! silahkan download Design Batik Digital kamu! </p>
                </div>
            </div>
        )
    }
}

export default PaymentStatusBanner