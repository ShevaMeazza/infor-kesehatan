import pool from "../config/db.js";

// Insert rekam medis
export const insertRekamMedis = async ({
    pendaftaran_id,
    dokter_id,
    keluhan,
    diagnosa,
    tindakan
}) => {
    const sql = `
        INSERT INTO rekam_medis 
        (pendaftaran_id, dokter_id, keluhan, diagnosa, tindakan)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        pendaftaran_id,
        dokter_id,
        keluhan,
        diagnosa,
        tindakan
    ]);

    return result;
};

export const insertResepObat = async ({
    rekam_medis_id,
    obat_id,
    jumlah
}) => {
    const sql = `
        INSERT INTO resep_obat (rekam_medis_id, obat_id, jumlah)
        VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        rekam_medis_id,
        obat_id,
        jumlah
    ]);

    return result;
};

export const getAllRekamMedis = async () => {
    const sql = `
        SELECT rm.*, 
            p.nama AS nama_pasien, 
            d.nama AS nama_dokter,
            po.nama_poli AS nama_poli
        FROM rekam_medis rm
        JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
        JOIN pasien p ON pd.pasien_id = p.id
        JOIN dokter d ON rm.dokter_id = d.id
        JOIN poli po ON pd.poli_id = po.id
        ORDER BY rm.id DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
};

export const getRekamMedisById = async (id) => {
    const sql = `
        SELECT rm.*, 
            p.nama AS nama_pasien, 
            d.nama AS nama_dokter,
            po.nama_poli AS nama_poli
        FROM rekam_medis rm
        JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
        JOIN pasien p ON pd.pasien_id = p.id
        JOIN dokter d ON rm.dokter_id = d.id
        JOIN poli po ON pd.poli_id = po.id
        WHERE rm.id = ?
    `;

    const [rows] = await pool.query(sql, [id]);
    return rows.length ? rows[0] : null;
};