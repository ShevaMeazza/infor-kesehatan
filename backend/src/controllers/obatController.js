import { 
    getAllObat, 
    tambahObat, 
    updateObat, 
    deleteObat 
} from "../models/obatModel.js"

export const listObat = async (req, res) => {
    try {
        const data = await getAllObat()
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const addObat = async (req, res) => {
    try {
        const result = await tambahObat(req.body)
        console.log(req.body)
        res.status(201).json({
            message: "Obat berhasil ditambahkan",
            insertId: result.insertId
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const editObat = async (req, res) => {
    try {
        const { id } = req.params
        await updateObat(id, req.body)
        res.json({ message: "Obat berhasil diupdate" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const removeObat = async (req, res) => {
    try {
        const { id } = req.params
        await deleteObat(id)
        res.json({ message: "Obat berhasil dihapus" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
