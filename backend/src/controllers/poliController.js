import { 
    getAllPoli,
    tambahPoli,
    updatePoli,
    deletePoli
} from "../models/poliModel.js";

export const listPoli = async (req, res) => {
    const data = await getAllPoli()
    res.json(data)
}

export const createPoli = async (req, res) => {
    const {nama} = req.body
    await tambahPoli(nama)
    res.json({ message: "poli berhasil ditambahkan"})
}

export const editPoli = async (req, res) => {
    const {id} = req.params
    const {nama} = req.body
    await updatePoli(id, nama)
    res.json({message: "poli berhasil di ubah"})
}

export const removePoli = async (req, res) => {
    const {id} = req.params
    await deletePoli(id)
    res.json({message: "poli berhasil di hapus"})
}