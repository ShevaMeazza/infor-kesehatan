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
    try {
        const { nama, nik, tanggal_lahir, alamat, no_hp } = req.body;

        if (!nama || !nik || !tanggal_lahir || !alamat) {
            return res.status(400).json({ message: "Field wajib diisi" });
        }

        const result = await tambahPasien({ nama, nik, tanggal_lahir, alamat, no_hp });

        res.status(201).json({
            message: "Pasien berhasil ditambahkan",
            insertId: result.insertId  // ← PASTIKAN ADA!
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
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
