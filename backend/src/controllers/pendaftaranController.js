import {
    tambahPendaftaran,
    getAllPendaftaran,
    getPendaftaranById,
    updateStatusPendaftaran,
    deletePendaftaran
} from "../models/pendaftaranModel.js"
import pool from "../config/db.js"

export const daftar = async (req, res) => {
    try {
        const { pasien_id, poli_id } = req.body;
        
        if (!pasien_id || !poli_id) {
            return res.status(400).json({ message: "Data poli wajib dipilih" });
        }

        const hasil = await tambahPendaftaran({ pasien_id, poli_id });       
        res.status(201).json({
            message: "Pendaftaran berhasil",
            insertId: hasil.insertId,
            nomor_antrian: hasil.no_antrian,
        });
    } catch (err) {
        console.error("Gagal Daftar:", err.message);
        res.status(500).json({ message: err.message });
    }
}

export const listPendaftaran = async (req, res) => {
    try {
        const rows = await getAllPendaftaran()
        res.json(rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getPendaftaran = async (req, res) => {
    try {
        const { id } = req.params
        
        const sql = `
            SELECT 
                p.id, 
                p.no_antrian, 
                p.tanggal, 
                p.status,
                rm.id AS rekam_medis_id, -- TAMBAHKAN INI
                ps.nama AS nama_pasien,
                pl.nama_poli,
                dk.nama AS nama_dokter, 
                dk.harga_dokter AS biaya_dokter 
            FROM pendaftaran p
            INNER JOIN pasien ps ON p.pasien_id = ps.id
            INNER JOIN poli pl ON p.poli_id = pl.id
            LEFT JOIN rekam_medis rm ON p.id = rm.pendaftaran_id
            LEFT JOIN dokter dk ON rm.dokter_id = dk.id
            WHERE p.id = ?
        `

        const [rows] = await pool.query(sql, [id])
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" })
        }
        
        res.json(rows[0])
    } catch (err) {
        console.error("ERROR SQL:", err.message)
        res.status(500).json({ message: err.message })
    }
}

export const setSelesaiPeriksa = async (req, res) => {
    const { id } = req.params; // ID Pendaftaran
    try {
        await pool.query("UPDATE pendaftaran SET status = 'menunggu pembayaran' WHERE id = ?", [id]);
        res.json({ message: "Pemeriksaan selesai, pasien diarahkan ke kasir/farmasi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const editStatusPendaftaran = async (req, res) => {
    const { id } = req.params;
    const { status, rekam_medis_id, total_obat, total_biaya } = req.body;

    console.log("Data diterima untuk Selesai:", req.body); // Cek ini di terminal!

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
                
        if (status === 'selesai' || status === 'Selesai') {            
            const rm_id = rekam_medis_id || null;
            const t_obat = total_obat || 0;
            const t_biaya = total_biaya || 0;

            const sqlPembayaran = `
                INSERT INTO pembayaran (rekam_medis_id, total_obat, total_biaya, tanggal, status)
                VALUES (?, ?, ?, NOW(), 'Lunas')
            `;
            await connection.query(sqlPembayaran, [rm_id, t_obat, t_biaya]);
            console.log("Berhasil simpan ke tabel pembayaran");
        }
        
        const sqlUpdate = "UPDATE pendaftaran SET status = ? WHERE id = ?";
        await connection.query(sqlUpdate, [status, id]);

        await connection.commit();
        res.json({ message: "Status diperbarui dan data pembayaran disimpan" });
    } catch (err) {
        await connection.rollback();
        console.error("GAGAL SIMPAN PEMBAYARAN:", err.message); // Pesan error akan muncul di sini
        res.status(500).json({ message: "Gagal: " + err.message });
    } finally {
        connection.release();
    }
};

export const removePendaftaran = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deletePendaftaran(id)

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" })
        }

        res.json({ message: "Pendaftaran dan data terkait berhasil dihapus" })
    } catch (err) {
        console.error("Error saat menghapus pendaftaran:", err)
        res.status(500).json({ message: "Gagal menghapus data: " + err.message })
    }
}

export const getStats = async (req, res) => {
    try {        
        const sql = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN LOWER(status) = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
                SUM(CASE WHEN LOWER(status) = 'pemeriksaan' THEN 1 ELSE 0 END) as pemeriksaan,
                SUM(CASE WHEN LOWER(status) = 'menunggu pembayaran' THEN 1 ELSE 0 END) as farmasi,
                SUM(CASE WHEN LOWER(status) = 'selesai' THEN 1 ELSE 0 END) as selesai
            FROM pendaftaran
        `
        const [rows] = await pool.query(sql)
        
        res.json({
            total: rows[0].total || 0,
            menunggu: parseInt(rows[0].menunggu) || 0,
            pemeriksaan: parseInt(rows[0].pemeriksaan) || 0,
            farmasi: parseInt(rows[0].farmasi) || 0,
            selesai: parseInt(rows[0].selesai) || 0
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const prosesPembayaranSelesai = async (req, res) => {
    const { id } = req.params; // ID Pendaftaran
    const { rekam_medis_id, total_obat, total_biaya } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const sqlPembayaran = `
            INSERT INTO pembayaran (rekam_medis_id, total_obat, total_biaya, tanggal, status)
            VALUES (?, ?, ?, NOW(), 'Lunas')
        `;
        await connection.query(sqlPembayaran, [rekam_medis_id, total_obat, total_biaya]);
        
        const sqlUpdatePendaftaran = `UPDATE pendaftaran SET status = 'Selesai' WHERE id = ?`;
        await connection.query(sqlUpdatePendaftaran, [id]);

        await connection.commit();
        res.json({ message: "Pembayaran berhasil diproses dan diarsipkan" });
    } catch (err) {
        await connection.rollback();
        console.error("Error Transaksi Pembayaran:", err.message);
        res.status(500).json({ message: "Gagal memproses transaksi" });
    } finally {
        connection.release();
    }
};