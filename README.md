# WantToTry Studio — Website

Website untuk self photo studio **WantToTry Studio**. Dibuat dengan HTML5, CSS3, dan JavaScript (vanilla ES6) — tanpa framework, tanpa database, dan tanpa backend — sehingga bisa langsung di-host di GitHub Pages atau hosting statis apa pun.

Setiap booking dikirim langsung sebagai pesan WhatsApp yang sudah terisi otomatis (nama, tanggal, jam, paket, dll) ke nomor studio. Tidak ada penyimpanan data booking di server — semua konfirmasi dilakukan lewat chat WhatsApp.

## Struktur Folder

```
index.html          Home
profil.html          Profil Studio
background.html      Galeri background (lightbox)
pricelist.html        Daftar harga
booking.html          Form booking → terkirim ke WhatsApp
contact.html         Kontak & peta lokasi

css/style.css         Semua styling
js/config.js          Konfigurasi (nomor WhatsApp, jam operasional, harga)
js/script.js          Navbar, animasi, lightbox, tombol mengambang
js/booking.js         Logika form booking & format pesan WhatsApp

images/logo/           Logo (beberapa ukuran, termasuk versi transparan)
images/background/     Placeholder foto background (SVG, rasio 4R potret 2:3) — ganti dengan foto asli
images/gallery/, icons/  Folder kosong, siap diisi
```

## 1. Ganti Nomor WhatsApp & Jam Operasional

Semua pengaturan penting ada di `js/config.js`:

- `WHATSAPP_NUMBER` — nomor tujuan booking (format internasional, tanpa `+` atau angka 0 di depan).
- `HOURS` — jam operasional. Saat ini: Senin–Kamis 10.00–20.00, Jumat–Minggu 08.00–20.00, buka setiap hari (tidak ada hari tutup).
- `SLOT_MINUTES` — jarak antar slot jam (saat ini 20 menit).
- `PACKAGES` — daftar kategori, background, dan paket beserta harga (dipakai juga untuk menghitung estimasi total di halaman Booking).

## 2. Cara Kerja Booking

Halaman Booking (`booking.html`) tidak terhubung ke database apa pun. Saat pengunjung mengisi form dan menekan **Booking Sekarang**:

1. `js/booking.js` merangkai semua detail booking menjadi satu pesan WhatsApp yang rapi dan sudah terformat.
2. Sebuah tab baru terbuka menuju `wa.me` dengan pesan tersebut sudah terisi otomatis di kolom chat WhatsApp studio.
3. Pengunjung tinggal menekan kirim di WhatsApp untuk menyelesaikan booking-nya.

Karena tidak ada database, jam yang ditampilkan di halaman Booking adalah **jam operasional**, bukan status ketersediaan real-time — ketersediaan dikonfirmasi manual oleh admin studio lewat chat.

## 3. Ganti Foto Background

Semua foto di halaman **Background** dan **Home** masih placeholder (file `.svg` di `images/background/`). Ganti dengan foto asli menggunakan rasio **4R potret (2:3)** agar tampilan tetap konsisten, lalu update nama file pada `background.html` dan `index.html` bila perlu.

## 4. Lokasi di Google Maps

Peta pada halaman Contact (`contact.html`) sudah diarahkan ke lokasi Want to Try Studio (koordinat -7.616304, 112.2374838). Tombol "Buka di Google Maps" mengarah langsung ke halaman tempat aslinya di Google Maps.

## 5. Hosting ke GitHub Pages

1. Push seluruh folder ini ke repository GitHub.
2. Buka **Settings > Pages** pada repository.
3. Pilih branch (misalnya `main`) dan folder root, lalu simpan.
4. Website akan aktif di `https://<username>.github.io/<repo>/`.

## 6. WhatsApp & Sosial Media

Nomor WhatsApp, Instagram, dan TikTok sudah ditautkan di seluruh halaman (footer, Contact, tombol mengambang, form Booking). Untuk mengganti nomor WhatsApp, cukup ubah `WHATSAPP_NUMBER` di `js/config.js`.
