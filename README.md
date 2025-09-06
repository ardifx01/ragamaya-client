# RagaMaya Client

<div align="center">
<img src="https://cdn.xann.my.id/ragamaya/59d42d65-43ee-4cc3-ba98-a1ae341d3a78.png" alt="Logo RagaMaya" width="200"/>
<h3>Temukan Makna, Hidupkan Budaya, Bersama RagaMaya</h3>

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1+-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9+-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/)

</div>

## 📖 Tentang

RagaMaya Client adalah aplikasi web frontend untuk platform RagaMaya yang dirancang untuk melestarikan, memperkenalkan, dan mengembangkan budaya Indonesia, khususnya batik, melalui teknologi modern. Repositori ini berisi kode sumber untuk antarmuka pengguna platform RagaMaya.

🌐 **Kunjungi platform kami: [ragamaya.space](https://ragamaya.space)**

Frontend ini dibangun dengan teknologi modern untuk memberikan pengalaman pengguna yang responsif dan interaktif, mendukung berbagai fitur seperti deteksi batik dengan AI, pembelajaran digital, dan marketplace batik.

## 🚀 Fitur

- Autentikasi Pengguna
- Dashboard Pengguna
- Deteksi Batik dengan AI
- Marketplace
- Sistem Pembelajaran
  - Artikel Edukasi
  - Kuis Interaktif
- Manajemen Transaksi
- Sistem Pembayaran
- Manajemen Sertifikat
- Manajemen Dompet Digital
- Responsive Design

## 🛠️ Teknologi yang Digunakan

- **Framework:** Next.js 15+
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **UI Components:** Custom Components
- **Payment Integration:** Midtrans
- **Animation:** Lottie
- **HTTP Client:** Axios

## ⚙️ Variabel Environment

Buat file `.env.local` di direktori root dan tambahkan variabel berikut:

```env
NEXT_PUBLIC_BASE_API=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## 🚀 Cara Memulai

1. Clone repositori
```bash
git clone https://github.com/RagaMaya/ragamaya-client.git
```

2. Install dependensi
```bash
npm install
# atau
yarn install
```

3. Setup variabel environment
```bash
cp .env.example .env.local
```

4. Jalankan aplikasi dalam mode development
```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
.
├── public/           # Aset statis
├── src/
│   ├── app/         # Routing dan halaman
│   ├── components/  # Komponen React
│   ├── helper/      # Helper functions
│   ├── lib/         # Utilitas dan konfigurasi
│   ├── providers/   # Context providers
│   └── types/       # Type definitions
```

## 🔨 Scripts

- `npm run dev` - Menjalankan aplikasi dalam mode development
- `npm run build` - Membuild aplikasi untuk production
- `npm run start` - Menjalankan aplikasi dalam mode production
- `npm run lint` - Menjalankan ESLint
- `npm run format` - Memformat kode dengan Prettier

## 📄 Lisensi

Proyek ini dilisensikan di bawah ketentuan lisensi yang disediakan dalam repositori.

## 👥 Kontributor

### Tim Pengembangan
- [Fahry Firdaus](https://github.com/Fahry169) - Frontend Developer
- [Kevin Sipahutar](https://github.com/vinss-droid) - Frontend Developer
- [Rama Diaz](https://github.com/ramadiaz) - Backend Developer

---

<div align="center">
<p>© 2025 RagaMaya. Semua Hak Dilindungi.</p>
</div>
