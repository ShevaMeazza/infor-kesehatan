import express from "express"
import {
    daftar,
    listPendaftaran,
    getPendaftaran,
    editStatusPendaftaran,
    removePendaftaran,
    getStats
} from "../controllers/pendaftaranController.js"
import pool from "../config/db.js"

const router = express.Router()

router.get("/", listPendaftaran)
router.post("/", daftar)
router.get("/stats", getStats)
router.get("/:id", getPendaftaran)    
router.put("/:id", editStatusPendaftaran)
router.delete("/:id", removePendaftaran)

router.get("/riwayat/pembayaran", async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.id, 
                p.tanggal, 
                p.total_obat, 
                p.total_biaya, 
                p.status,
                ps.nama AS nama_pasien,
                rm.id AS rekam_medis_id
            FROM pembayaran p
            JOIN rekam_medis rm ON p.rekam_medis_id = rm.id
            JOIN pendaftaran pen ON rm.pendaftaran_id = pen.id
            JOIN pasien ps ON pen.pasien_id = ps.id
            ORDER BY p.tanggal DESC
        `
        const [rows] = await pool.query(sql)
        res.json(rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router
