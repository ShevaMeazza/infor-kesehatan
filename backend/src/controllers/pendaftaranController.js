import { 
    tambahPendaftaran, 
    getAllPendaftaran, 
    updateStatusPendaftaran
} from "../models/pendaftaranModel.js"

export const daftar = async (req, res) => {
    try {
        const { pasien_id, poli_id, tanggal } = req.body
        if (!pasien_id || !poli_id || !tanggal) {
            return res.status(400).json({ message: "pasien_id, poli_id, tanggal wajib" })
        }
        const hasil = await tambahPendaftaran({ pasien_id, poli_id, tanggal })
        res.status(201).json({ message: "Pendaftaran berhasil", data: hasil })
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

export const editStatusPendaftaran = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!status) {
            return res.status(400).json({ message: "Status harus diisi" })
        }

        const result = await updateStatusPendaftaran(id, status)

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pendaftaran tidak ditemukan" })
        }

        res.json({ message: "Status berhasil diperbarui" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
