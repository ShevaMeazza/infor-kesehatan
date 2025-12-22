import { 
    getAllDokter,
    getDokterById,
    tambahDokter,
    updateDokter,
    deleteDokter
} from "../models/dokterModel.js";
import pool from "../config/db.js";

export const listDokter = async (req, res) => {
    try {        
        const sql = `
            SELECT d.*, p.nama_poli 
            FROM dokter d 
            LEFT JOIN poli p ON d.poli_id = p.id
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createDokter = async (req, res) => {
    const { nama, spesialis, harga_dokter, poli_id } = req.body;
    try {
        await pool.query(
            "INSERT INTO dokter (nama, spesialis, harga_dokter, poli_id) VALUES (?, ?, ?, ?)",
            [nama, spesialis, harga_dokter, poli_id]
        );
        res.status(201).json({ message: "Dokter berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const detailDokter = async (req, res) => {
    try {
        const { id } = req.params;        
        const data = await getDokterById(id);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }
        
        res.json(data[0] || data); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getDokter = async (req, res) => {
    try {
        const sql = `
            SELECT d.*, p.nama_poli 
            FROM dokter d 
            LEFT JOIN poli p ON d.poli_id = p.id
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const editDokter = async (req, res) => {
    try {
        const { id } = req.params;
        // 3. TAMBAHKAN AWAIT: Operasi database wajib ditunggu (async)
        const result = await updateDokter(id, req.body);

        res.json({
            message: "Berhasil mengubah dokter",
            affectedRows: result.affectedRows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const removeDokter = async (req, res) => {
    try {
        const { id } = req.params;
        // 4. TAMBAHKAN AWAIT
        const result = await deleteDokter(id);

        res.json({
            message: "Berhasil menghapus dokter",
            affectedRows: result.affectedRows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}