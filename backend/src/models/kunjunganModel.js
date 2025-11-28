import pool from "../config/db.js";

export const tambahKunjungan = async (data) => {
    const { pasien_id, dokter_id, tanggal, keluhan, diagnosa, obat_id } = data;

    const sql = `
        INSERT INTO kunjungan (pasien_id, dokter_id, tanggal, keluhan, diagnosa, obat_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        pasien_id,
        dokter_id,
        tanggal,
        keluhan,
        diagnosa,
        obat_id
    ]);

    return result;
};

export const getKunjungan = async () => {
    const sql = "SELECT * FROM kunjungan";
    const [rows] = await pool.query(sql);
    return rows;
};
