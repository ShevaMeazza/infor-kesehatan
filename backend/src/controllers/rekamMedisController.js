import pool from "../config/db.js"
import { getAllRekamMedis } from "../models/rekamMedisModel.js"

export const listRekamMedis = async (req, res) => {
    try {
        const data = await getAllRekamMedis()
        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

export const addRekamMedis = async (req, res) => {
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        const { pendaftaran_id, dokter_id, keluhan, diagnosa, tindakan, resep } = req.body
        
        const sqlRM = `
            INSERT INTO rekam_medis (pendaftaran_id, dokter_id, keluhan, diagnosa, tindakan, tanggal)
            VALUES (?, ?, ?, ?, ?, NOW())
        `
        const [resultRM] = await connection.query(sqlRM, [
            pendaftaran_id, dokter_id, keluhan, diagnosa, tindakan
        ])
        const rekam_medis_id = resultRM.insertId
        
        if (resep && resep.length > 0) {
            const sqlResep = `INSERT INTO resep_obat (rekam_medis_id, obat_id, jumlah) VALUES (?, ?, ?)`
            for (const item of resep) {
                await connection.query(sqlResep, [rekam_medis_id, item.obat_id, item.jumlah])
                                
                await connection.query(
                    "UPDATE obat SET stok = stok - ? WHERE id = ?", 
                    [item.jumlah, item.obat_id]
                )
            }
        }
        
        await connection.query(
            "UPDATE pendaftaran SET status = 'menunggu_pembayaran' WHERE id = ?",
            [pendaftaran_id]
        )

        await connection.commit()

        res.status(201).json({
            message: "Rekam medis dan resep berhasil disimpan",
            insertId: rekam_medis_id
        })

    } catch (err) {
        await connection.rollback()
        console.error(err)
        res.status(500).json({ message: "Gagal menyimpan data: " + err.message })
    } finally {
        connection.release()
    }
}