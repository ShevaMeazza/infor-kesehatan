import {
    tambahResep,
    getResepByRekamMedis,
    hapusResep
} from "../models/resepModel.js"
import pool from "../config/db.js"

export const addResep = async (req, res) => {
    try {
        const result = await tambahResep(req.body)
        res.status(201).json({
            message: "Resep berhasil ditambahkan",
            insertId: result.insertId
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const listResepByRekam = async (req, res) => {
    try {
        const { rekam_medis_id } = req.params
        const data = await getResepByRekamMedis(rekam_medis_id)
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const removeResep = async (req, res) => {
    try {
        const { id } = req.params
        await hapusResep(id)
        res.json({ message: "Resep berhasil dihapus" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getResepByPendaftaran = async (req, res) => {
    try {
        const { id } = req.params; // Ini adalah ID Pendaftaran dari URL
        const sql = `
            SELECT 
                ro.*, 
                o.nama_obat, 
                o.harga 
            FROM resep_obat ro
            JOIN rekam_medis rm ON ro.rekam_medis_id = rm.id
            JOIN obat o ON ro.obat_id = o.id
            WHERE rm.pendaftaran_id = ?
        `;
        const [rows] = await pool.query(sql, [id]);
        res.json(rows);
    } catch (err) {
        console.error("Error Resep:", err.message);
        res.status(500).json({ message: err.message });
    }
};