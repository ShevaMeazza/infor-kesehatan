import {
    tambahPendaftaran,
    getAllPendaftaran,
    getPendaftaranById,
    updateStatusPendaftaran,
    deletePendaftaran
} from "../models/pendaftaranModel.js"

export const daftar = async (req, res) => {
    try {
        console.log("BODY DITERIMA (pendaftaran):", req.body)
        const { pasien_id, poli_id } = req.body
        if (!pasien_id || !poli_id) {
            return res.status(400).json({ message: "pasien_id dan poli_id wajib" })
        }

        const hasil = await tambahPendaftaran({ pasien_id, poli_id })        
        res.status(201).json({
            message: "Pendaftaran berhasil",
            insertId: hasil.insertId,
            nomor_antrian: hasil.no_antrian,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
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
        const row = await getPendaftaranById(id)
        if (!row)
            return res.status(404).json({ message: "Pendaftaran tidak ditemukan" })
        
        return res.json({ ...row, nomor_antrian: row.no_antrian })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const editStatusPendaftaran = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        if (!status) return res.status(400).json({ message: "Status harus diisi" })

        const result = await updateStatusPendaftaran(id, status)
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Pendaftaran tidak ditemukan" })

        res.json({ message: "Status berhasil diperbarui" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const removePendaftaran = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deletePendaftaran(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
        }

        res.json({ message: "Pendaftaran dan data terkait berhasil dihapus" });
    } catch (err) {
        console.error("Error saat menghapus pendaftaran:", err);
        res.status(500).json({ message: "Gagal menghapus data: " + err.message });
    }
};