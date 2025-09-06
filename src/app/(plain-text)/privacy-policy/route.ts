import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    `Privacy Policy for Ragamaya

Last Updated: September 5, 2025

Ragamaya berkomitmen untuk melindungi privasi dan data pribadi pengguna. 
Dengan menggunakan layanan Ragamaya, Anda menyetujui kebijakan ini.

1. Informasi yang Kami Kumpulkan
- Informasi pribadi yang Anda berikan saat mendaftar atau menggunakan layanan.
- Data teknis seperti alamat IP, jenis perangkat, dan aktivitas penggunaan.
- Gambar yang Anda unggah untuk keperluan deteksi motif batik.

2. Penggunaan Informasi
- Memberikan layanan utama Ragamaya seperti deteksi motif batik dan konten edukasi.
- Peningkatan kualitas layanan melalui analisis data.
- Menyediakan komunikasi terkait layanan.

3. Penyimpanan dan Keamanan Data
- Data disimpan secara aman dengan praktik terbaik industri.
- Kami tidak menjual atau membagikan data pribadi kepada pihak ketiga tanpa persetujuan Anda.

4. Hak Pengguna
- Anda berhak mengakses, memperbarui, atau menghapus data pribadi Anda.
- Anda dapat menghubungi kami untuk permintaan terkait privasi.

5. Perubahan Kebijakan
- Kebijakan ini dapat diperbarui dari waktu ke waktu.
- Perubahan akan diumumkan di situs Ragamaya.

6. Kontak
Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami melalui email: support@ragamaya.space

Dengan menggunakan layanan Ragamaya, Anda menyetujui kebijakan privasi ini.`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
