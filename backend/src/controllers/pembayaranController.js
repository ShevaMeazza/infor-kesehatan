import { 
    hitungTotalObat,
    simpanPembayaran, 
    getAllPembayaran ,
    getBiayaDokter
} from "../models/pembayaranModel.js";

export const prosesPembayaran = async (req, res) => {
    try {
        const { rekam_medis_id } = req.body;

        const total_obat = await hitungTotalObat(rekam_medis_id);

        const biaya_dokter = await getBiayaDokter(rekam_medis_id);

        const total_biaya = total_obat + biaya_dokter;

        const result = await simpanPembayaran({
            rekam_medis_id,
            total_obat,
            total_biaya
        });

        res.json({
            message: "Pembayaran berhasil",
            total_obat,
            biaya_dokter,
            total_biaya,
            insertId: result.insertId
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const listPembayaran = async (req, res) => {
    try {
        const data = await getAllPembayaran();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
