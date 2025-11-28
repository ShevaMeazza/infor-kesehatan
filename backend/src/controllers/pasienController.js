import {
    getAllPasien,
    getPasienById,
    tambahPasien,
    updatePasien,
    deletePasien,
} from "../models/pasienModel.js";

export const listPasien = async (req, res) => {
    const data = await getAllPasien();
    res.json(data);
};

export const detailPasien = async (req, res) => {
    const { id } = req.params;
    const data = await getPasienById(id);

    if (!data) return res.status(404).json({ message: "Pasien tidak ditemukan" });

    res.json(data);
};

export const createPasien = async (req, res) => {
    const result = await tambahPasien(req.body);

    res.json({
        message: "Berhasil menambahkan pasien",
        id: result.insertId,
    });
};

export const editPasien = async (req, res) => {
    const { id } = req.params;
    const result = await updatePasien(id, req.body);

    res.json({
        message: "Pasien berhasil diupdate",
        affectedRows: result.affectedRows,
    });
};

export const removePasien = async (req, res) => {
    const { id } = req.params;
    const result = await deletePasien(id);

    res.json({
        message: "Pasien berhasil dihapus",
        affectedRows: result.affectedRows,
    });
};
