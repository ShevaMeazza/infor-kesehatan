import {
    tambahResep,
    getResepByRekamMedis,
    hapusResep
} from "../models/resepModel.js"

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
