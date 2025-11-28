import { 
    tambahRekamMedis, 
    getAllRekamMedis 
} from "../models/rekamMedis.js"

export const listRekamMedis = async (req, res) => {
    try {
        const data = await getAllRekamMedis()
        res.json(data)
    } catch (err) {
        res.status(500).json({message: error.message})
    }
}

export const addRekamMedis = async (req, res) => {
    try {
        const result = await tambahRekamMedis(req.body)
        res.status(201).json({
            message: "rekam medis berhasil dibuat",
            insertId : result.insertId
        })
    } catch (err) {
        res.status(500).json({message: error.message})
    }
}