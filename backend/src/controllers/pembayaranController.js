import pool from "../config/db.js"
import { 
    hitungTotalObat,
    simpanPembayaran, 
    getAllPembayaran ,
    getBiayaDokter
} from "../models/pembayaranModel.js"

export const prosesPembayaran = async (req, res) => {
    // Kita gunakan koneksi dari pool untuk handle Transaction
    const connection = await pool.getConnection()

    try {
        const { rekam_medis_id, metode_pembayaran } = req.body

        if (!rekam_medis_id) {
            return res.status(400).json({ message: "Rekam Medis ID diperlukan" })
        }

        // 1. Mulai Transaksi Database
        await connection.beginTransaction()

        // 2. Hitung Rincian Biaya
        const total_obat = await hitungTotalObat(rekam_medis_id)
        const biaya_dokter = await getBiayaDokter(rekam_medis_id)
        const total_biaya = total_obat + biaya_dokter

        // 3. Simpan data ke tabel pembayaran
        // Tambahkan metode_pembayaran jika di model sudah mendukung
        const result = await simpanPembayaran({
            rekam_medis_id,
            total_obat,
            total_biaya,
            metode_pembayaran: metode_pembayaran || 'Tunai'
        })

        // 4. Cari pendaftaran_id terkait untuk update status
        const [rmData] = await connection.query(
            "SELECT pendaftaran_id FROM rekam_medis WHERE id = ?", 
            [rekam_medis_id]
        )

        if (rmData.length === 0) {
            throw new Error("Data Rekam Medis tidak ditemukan")
        }

        const pendaftaran_id = rmData[0].pendaftaran_id

        // 5. Update status Pendaftaran menjadi 'Selesai'
        // Inilah yang memicu auto-redirect di HP Pasien
        await connection.query(
            "UPDATE pendaftaran SET status = 'Selesai' WHERE id = ?",
            [pendaftaran_id]
        )

        // 6. Jika semua sukses, Commit (simpan permanen)
        await connection.commit()

        res.json({
            message: "Pembayaran berhasil, pasien selesai.",
            data: {
                pendaftaran_id,
                total_obat,
                biaya_dokter,
                total_biaya,
                pembayaran_id: result.insertId
            }
        })

    } catch (err) {
        // Jika ada salah satu yang gagal, batalkan semua (Rollback)
        await connection.rollback()
        console.error("Error Proses Pembayaran:", err)
        res.status(500).json({ message: err.message })
    } finally {
        // Kembalikan koneksi ke pool
        connection.release()
    }
}

export const listPembayaran = async (req, res) => {
    try {
        const data = await getAllPembayaran()
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}