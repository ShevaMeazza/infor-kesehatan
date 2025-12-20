🏥 Klinik App – Sistem Informasi Klinik Terpadu
Aplikasi web manajemen klinik yang mengintegrasikan alur pelayanan pasien mulai dari pendaftaran, pemeriksaan rekam medis oleh dokter, hingga proses transaksi di kasir.

🚀 Tech Stack
Backend (Node.js & Express)
Runtime: Node.js

Framework: Express.js

Database: MySQL dengan library mysql2/promise

API Style: REST API dengan format JSON

Frontend (React & Tailwind)
Library Utama: React.js (Vite)

Styling: Tailwind CSS (Modern & Responsive UI)

State Management: React Hooks (useState, useEffect)

Routing: React Router Dom v6

HTTP Client: Axios

Alerts: SweetAlert2 untuk feedback interaktif

📦 Fitur Utama
1. Manajemen Pasien & Antrian
Registrasi pasien baru ke dalam sistem.

Pendaftaran kunjungan pasien dengan Nomor Antrian Otomatis.

Update status antrian secara real-time (Menunggu, Dipanggil, Selesai).

2. Pemeriksaan Medis (Dokter)
Pemanggilan data pendaftaran berdasarkan ID.

Input data pemeriksaan: Keluhan, Diagnosa, dan Tindakan.

Fitur Resep Obat Dinamis: Dokter dapat menambah banyak obat sekaligus dalam satu form tanpa pindah halaman.

3. Manajemen Master Data
CRUD (Create, Read, Update, Delete) lengkap untuk data Dokter, Poli, dan Obat.

Manajemen stok obat yang berkurang otomatis setiap kali resep dibuat.

4. Sistem Pembayaran (Kasir)
Kalkulasi otomatis total biaya berdasarkan:

Biaya jasa dokter (berdasarkan poli).

Total harga obat (Harga Satuan × Jumlah).

Status pembayaran otomatis berubah menjadi Lunas setelah transaksi sukses.

🗄️ Struktur Database
Database klinik terdiri dari tabel-tabel yang saling berelasi:

pasien: Data identitas pasien.

poli: Daftar poliklinik.

dokter: Data dokter beserta spesialis dan biaya jasanya.

pendaftaran: Data antrian harian pasien.

rekam_medis: Catatan kesehatan hasil pemeriksaan.

obat: Inventaris obat dan stok.

resep_obat: Jembatan antara rekam medis dan banyak obat yang diberikan.

pembayaran: Data transaksi keuangan.

⚙️ Instalasi & Cara Menjalankan
1. Persiapan Database
Import file SQL database Anda ke MySQL (PHPMyAdmin atau MySQL Workbench).

Pastikan database bernama klinik.

2. Setup Backend

cd backend
npm install
Atur koneksi database di file config/db.js:

JavaScript

export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "", // Kosongkan jika default XAMPP
  database: "klinik"
});

Jalankan server:
npm run dev

3. Setup Frontend

cd frontend
npm install
Pastikan baseURL di src/api/axios.js mengarah ke http://localhost:5001.

Jalankan aplikasi:
npm run dev
