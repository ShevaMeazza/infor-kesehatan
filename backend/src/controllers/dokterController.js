import { 
    getAllDokter,
    getDokterById,
    tambahDokter,
    updateDokter,
    deleteDokter
} from "../models/dokterModel.js";

export const listDokter = async (req, res) => {
    try {
        const data = await getAllDokter();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const detailDokter = async (req, res) => {
    const {id} = req.params
    const data = getDokterById(id)    

    if(!data) return res.status(404).json({message: "Dokter tidak ditemukan"})
    
    res.json(data)
}

export const createDokter = async (req, res) => {
    try {
        const {nama, spesialis, poli_id} = req.body

        await tambahDokter({nama, spesialis, poli_id})
    
        res.json({
            message: "berhasil menambahkan dokter",            
        })
    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

export const editDokter = async (req, res) => {
    const {id} = req.params
    const result = await updateDokter(id, req.body)

    res.json({
        message: "berhasil mengubah dokter",
        affectedRows: result.affectedRows
    })
}

export const removeDokter = async (req, res) => {
    const {id} = req.params
    const result = await deleteDokter(id)

    res.json({
        message: "berhasil menghapus dokter",
        affectedRows: result.affectedRows
    })
}
