import pool from "../config/db.js";

export const tambahRekamMedis = async (data) => {
    const { pendaftaran_id, dokter_id, keluhan, diagnosa, tindakan } = data

    const sql = `
    INSERT INTO rekam_medis 
    (pendaftaran_id, dokter_id, keluhan, diagnosa, tindakan)
    VALUES (?,?,?,?,?)
    `

    const [result] = await pool.query(sql, [
        pendaftaran_id,
        dokter_id,
        keluhan,
        diagnosa,
        tindakan
    ])
    return result
}

export const getAllRekamMedis = async () => {
    const sql = `
        SELECT rm.*, 
            p.nama AS nama_pasien, 
            d.nama AS nama_dokter,
            po.nama AS nama_poli
        FROM rekam_medis rm
        JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
        JOIN pasien p ON pd.pasien_id = p.id
        JOIN dokter d ON rm.dokter_id = d.id
        JOIN poli po ON pd.poli_id = po.id
    `;
    const [rows] = await pool.query(sql);
    return rows;
}