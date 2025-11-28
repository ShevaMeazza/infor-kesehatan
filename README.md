# 🏥 Sistem Informasi Klinik – Backend (Express + MySQL)

Backend ini merupakan bagian dari proyek **Sistem Informasi Klinik** menggunakan **Node.js**, **Express**, dan **MySQL**.  
Fitur mencakup seluruh alur layanan klinik, mulai dari pendaftaran pasien hingga pembayaran.

---

## 🚀 Tech Stack

- **Node.js** – runtime
- **Express.js** – backend framework
- **MySQL** – relational database
- **MySQL2** – database driver
- **CORS** – akses API
- **REST API** – komunikasi frontend-backend

---

## 📦 Fitur Utama Backend

### **1. Pasien**
- Tambah pasien
- Lihat semua pasien
- Update pasien
- Hapus pasien

### **2. Poli**
- Tambah poli
- Lihat semua poli

### **3. Dokter**
- Tambah dokter
- Lihat semua dokter
- Update dokter
- Hapus dokter
- Relasi poli → dokter  
- Harga dokter untuk perhitungan pembayaran

### **4. Obat**
- Tambah obat
- Lihat semua obat
- Update obat
- Hapus obat

### **5. Pendaftaran**
- Tambah pendaftaran pasien
- Nomor antrian otomatis
- Update status (menunggu, dipanggil, selesai)

### **6. Rekam Medis**
- Membuat rekam medis berdasarkan pendaftaran
- Diisi oleh dokter (keluhan, diagnosa, tindakan)

### **7. Resep Obat**
- Tambah resep obat berdasarkan rekam medis
- Relasi dengan obat dan stok

### **8. Pembayaran**
- Hitung total biaya otomatis:
  - Total harga obat × jumlah
  - Biaya dokter
- Simpan transaksi pembayaran
- Tandai status sebagai “lunas”

---

## 🗄️ Database Structure

Struktur database mencakup tabel:

- **pasien**
- **poli**
- **dokter**
- **pendaftaran**
- **rekam_medis**
- **obat**
- **resep_obat**
- **pembayaran**

Database mengikuti alur layanan klinik dari awal hingga akhir.

---

## ⚙️ Cara Menjalankan Backend

### 1. Install dependencies
npm install

### 2. Atur koneksi MySQL di `db.js`
js
export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "klinik"
});
disini db nya tidak menggunakan dotenv karena error jadi db nya langsung di db.js nya

### 3. Jalankan Server
npm run dev
nanti akan jalan di : http://localhost:5001
### semua endpoint diuji di POSTMAN
