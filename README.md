# Converter EkaFarm: WebP Image Converter

Tools internal tim IT Eka Farm untuk mengonversi gambar ke format WebP langsung di browser. Dibuat untuk mendukung kerja SEO: gambar yang lebih ringan membuat halaman lebih cepat dimuat, dan kecepatan halaman berpengaruh ke Core Web Vitals (terutama LCP) serta pengalaman pengunjung.

Semua proses berjalan lokal di browser lewat Canvas API. Gambar tidak pernah diunggah ke server.

- Repo: `agro-sukses-abadi/converter-ekafarm`
- Pengguna: tim Eka Farm (konten, SEO, dan admin website)
- Pengelola: tim IT Agro Sukses Abadi (akun `agro-devops`)

## Kenapa Ada Tools Ini

Gambar PNG dan JPG dari desain atau kamera biasanya berukuran besar. Untuk website brand (Eka Farm, Amandia, Orisa Catering, dan lainnya), gambar yang tidak dioptimasi sering jadi penyebab skor kecepatan turun. Tools ini membuat alurnya sederhana: unggah, atur kualitas, konversi, unduh. Tidak perlu aplikasi tambahan dan tidak perlu mengirim aset ke layanan pihak ketiga.

## Fitur

- Seret dan lepas gambar, klik untuk memilih file, atau tempel dari clipboard
- Unggah banyak gambar sekaligus, termasuk seret folder (jika didukung browser)
- Konversi ke WebP lewat Canvas, dengan slider kualitas 0 sampai 100 (default 85)
- Ubah ukuran berdasarkan lebar atau tinggi, dengan opsi menjaga rasio
- Latar belakang transparan, putih, hitam, atau warna kustom
- Kartu pratinjau: dimensi, format asal, ukuran sebelum dan sesudah, persentase penghematan, dan jumlah byte yang dihemat
- Konversi massal, unduh per gambar, atau unduh semuanya sebagai ZIP
- Salin hasil WebP ke clipboard (jika didukung browser)
- Statistik ringkas, notifikasi toast, dan tampilan responsif (desktop, tablet, mobile)
- PWA: bisa dipasang dan tetap terbuka saat offline

## Tech Stack

| Bagian | Teknologi | Peran |
| --- | --- | --- |
| UI | React 19 | Komponen dan state |
| Bahasa | TypeScript (strict mode) | Keamanan tipe |
| Build | Vite | Dev server dan bundling |
| Styling | Tailwind CSS v4 | Utility styling dan design token |
| Animasi | Motion | Transisi dan animasi statistik |
| Ikon | Lucide React | Ikon antarmuka |
| Arsip | JSZip | Unduhan ZIP untuk konversi massal |
| Font | Nunito Variable, JetBrains Mono Variable | Teks utama dan teks monospace (self-hosted) |
| Kualitas kode | ESLint dan Prettier | Lint dan format |
| Konversi | Canvas API (`createImageBitmap`, `canvas.toBlob`) | Decode, render, dan encode WebP di browser |
| Hosting | Niagahoster (subdomain) | Situs statis |
| Versi kode | GitHub (org `agro-sukses-abadi`) | Riwayat dan kolaborasi |

Tidak ada backend, database, analytics, maupun layanan pemrosesan gambar eksternal.

## Identitas Visual

Logo berupa tiga daun dalam satu tunas. Warna dasarnya diambil dari logo Eka Farm:

| Peran | Warna | Hex |
| --- | --- | --- |
| Daun tengah (hijau terang) | ![#a9d463](https://placehold.co/16x16/a9d463/a9d463.png) | `#a9d463` |
| Daun kanan (hijau sedang) | ![#80c14d](https://placehold.co/16x16/80c14d/80c14d.png) | `#80c14d` |
| Daun kiri dan theme color (hijau tua) | ![#467f43](https://placehold.co/16x16/467f43/467f43.png) | `#467f43` |
| Latar halaman dan ikon | ![#fafafa](https://placehold.co/16x16/fafafa/fafafa.png) | `#fafafa` |
| Garis tepi lembut | ![#dee8dd](https://placehold.co/16x16/dee8dd/dee8dd.png) | `#dee8dd` |

Warna `#467f43` dipakai sebagai `theme-color` di `index.html` dan `theme_color` di manifest PWA. Warna `#fafafa` dipakai sebagai `background_color` manifest dan alas favicon.

Aset logo ada di `public/logo.svg` (latar transparan, untuk header) dan `public/favicon.svg` (alas putih membulat supaya terbaca di tab gelap maupun terang).

## Cara Menjalankan

Prasyarat: Node.js dan npm.

```bash
npm install
npm run dev
```

Perintah yang tersedia:

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan dev server Vite |
| `npm run build` | Cek tipe TypeScript dan membuat output produksi di `dist/` |
| `npm run preview` | Menyajikan hasil build secara lokal |
| `npm run lint` | Menjalankan ESLint |
| `npm run format` | Memformat kode dengan Prettier |

Service worker hanya aktif pada build produksi, jadi uji PWA lewat `npm run build` lalu `npm run preview`.

## Struktur Proyek

```text
src/
├── components/   Komponen UI (Header, UploadZone, SettingsPanel, PreviewGrid, dll.)
├── hooks/        Hook React (useLocalStorage, useToasts)
├── lib/          Proses gambar dan unduhan (imageProcessor, download)
├── pages/        Halaman utama (ConverterPage)
├── styles/       Tailwind dan design token (global.css)
├── types/        Tipe TypeScript bersama
├── utils/        Helper format dan file
├── App.tsx
└── main.tsx      Entry point dan registrasi service worker
public/           logo.svg, favicon.svg, manifest.webmanifest, sw.js
```

Dokumentasi teknis yang lebih rinci ada di `PROJECT_DOCUMENTATION.md`.

## Deploy ke Niagahoster (Subdomain)

Hasil build di `dist/` adalah situs statis. Hosting tidak perlu menjalankan Node.

1. Pastikan subdomain sudah dibuat di panel Niagahoster dan folder tujuannya diketahui.
2. Build:
   ```bash
   npm run build
   ```
3. Simulasi dulu (hanya menampilkan daftar file, tidak mengubah apa pun):
   ```bash
   rsync -avzn dist/ login-niagahoster:<folder-subdomain>/
   ```
4. Jika daftarnya wajar, jalankan tanpa `n`:
   ```bash
   rsync -avz dist/ login-niagahoster:<folder-subdomain>/
   ```

Catatan:

- `login-niagahoster` adalah alias SSH di `~/.ssh/config` pengelola. Jangan masukkan kunci atau kredensial ke repo.
- Karena dipasang di subdomain (bukan subfolder), `base` di `vite.config` cukup `/`.
- Yang diunggah adalah **isi** `dist/`, bukan foldernya.

## Batasan yang Diketahui

- GIF hanya mengonversi frame pertama.
- Dukungan TIFF bergantung pada kemampuan decode browser.
- Menyalin gambar ke clipboard bisa diblokir oleh izin browser.
- Hasil kualitas ekspor Canvas bisa sedikit berbeda antar browser.

## Rencana Lanjutan

- Ikon PNG 192 dan 512 (serta `apple-touch-icon`) untuk Safari dan pemasangan PWA
- Pengarsipan sumber desain logo di folder `design/`

## Kontribusi

Proyek ini dikelola tim IT Agro Sukses Abadi. Alurnya:

1. Buat branch dari `main`.
2. Pastikan `npm run lint` dan `npm run build` lolos.
3. Commit dengan pesan bergaya konvensional, misalnya `feat: ...`, `fix: ...`, `docs: ...`.
4. Push dan ajukan pull request.

## Privasi

Semua gambar dibaca, dikonversi, dan diunduh di perangkat pengguna. Tidak ada data gambar yang dikirim ke server mana pun.