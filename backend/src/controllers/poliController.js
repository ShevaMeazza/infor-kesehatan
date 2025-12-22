import { 
    getAllPoli,
    tambahPoli,
    updatePoli,
    deletePoli
} from "../models/poliModel.js";
import pool from "../config/db.js";

export const listPoli = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM poli");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPoli = async (req, res) => {
    const { nama_poli } = req.body;
    try {
        await pool.query("INSERT INTO poli (nama_poli) VALUES (?)", [nama_poli]);
        res.status(201).json({ message: "Poli berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const editPoli = async (req, res) => {
    const {id} = req.params
    const {nama} = req.body
    await updatePoli(id, nama)
    res.json({message: "poli berhasil di ubah"})
}

export const removePoli = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cek dulu apakah masih ada dokter di poli ini (opsional untuk keamanan)
        const [check] = await pool.query("SELECT COUNT(*) as count FROM dokter WHERE poli_id = ?", [id]);
        
        if (check[0].count > 0) {
            return res.status(400).json({ 
                message: "Poli tidak bisa dihapus karena masih memiliki dokter. Hapus atau pindahkan dokter terlebih dahulu." 
            });
        }

        const [result] = await pool.query("DELETE FROM poli WHERE id = ?", [id]);
        res.json({ message: "Poli berhasil dihapus" });
    } catch (err) {
        console.error("EROR HAPUS POLI:", err.message);
        res.status(500).json({ message: "Gagal menghapus poli: " + err.message });
    }
};