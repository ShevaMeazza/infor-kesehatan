import { 
    tambahKunjungan, 
    getKunjungan 
} from "../models/kunjunganModel.js";

export const createKunjungan = async (req, res) => {
    try {
        const result = await tambahKunjungan(req.body);
        res.status(201).json({
            message: "Kunjungan berhasil ditambah",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const listKunjungan = async (req, res) => {
    try {
        const rows = await getKunjungan();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
