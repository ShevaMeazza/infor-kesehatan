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
        // Konsisten gunakan err atau error
        res.status(500).json({ message: err.message });
    }
}

export const detailDokter = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. TAMBAHKAN AWAIT: Tanpa await, data akan berisi Promise, bukan hasil query
        const data = await getDokterById(id);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }
        
        res.json(data[0] || data); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const createDokter = async (req, res) => {
    try {
        const { nama, spesialis, poli_id } = req.body;
        if (!nama || !spesialis) {
            return res.status(400).json({ message: "Nama dan Spesialis wajib diisi" });
        }

        await tambahDokter({ nama, spesialis, poli_id });
    
        res.status(201).json({
            message: "Berhasil menambahkan dokter",            
        });
    } catch (err) { // 2. PERBAIKAN: Ubah 'error' menjadi 'err' agar sesuai dengan res.json
        res.status(500).json({ message: err.message });
    }
}

export const editDokter = async (req, res) => {
    try {
        const { id } = req.params;
        // 3. TAMBAHKAN AWAIT: Operasi database wajib ditunggu (async)
        const result = await updateDokter(id, req.body);

        res.json({
            message: "Berhasil mengubah dokter",
            affectedRows: result.affectedRows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const removeDokter = async (req, res) => {
    try {
        const { id } = req.params;
        // 4. TAMBAHKAN AWAIT
        const result = await deleteDokter(id);

        res.json({
            message: "Berhasil menghapus dokter",
            affectedRows: result.affectedRows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}