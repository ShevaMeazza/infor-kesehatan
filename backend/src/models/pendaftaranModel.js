import pool from "../config/db.js";

export const getNextAntrian = async (tanggal, poli_id) => {
    const sql = `
    SELECT MAX(no_antrian) AS max_antrian
    FROM pendaftaran
    WHERE tanggal = ? AND poli_id = ?`;
    const [rows] = await pool.query(sql, [tanggal, poli_id]);
    const last = rows[0]?.max_antrian ?? 0;
    return last + 1;
};

export const tambahPendaftaran = async ({ pasien_id, poli_id, tanggal }) => {
    const nextAntrian = await getNextAntrian(tanggal, poli_id);

    const sql = `INSERT INTO pendaftaran
    (pasien_id, poli_id, tanggal, status, no_antrian)
    VALUES (?, ?, ?, ?, ?)`;

    const [result] = await pool.query(sql, [
        pasien_id,
        poli_id,
        tanggal,
        "menunggu",  
        nextAntrian
    ]);

    return { insertId: result.insertId, no_antrian: nextAntrian };
};

export const getAllPendaftaran = async () => {
    const sql = `
    SELECT p.*, pa.nama AS nama_pasien, po.nama AS nama_poli
    FROM pendaftaran p
    JOIN pasien pa ON pa.id = p.pasien_id
    JOIN poli po ON po.id = p.poli_id
    ORDER BY p.tanggal DESC, p.no_antrian ASC`;
    const [rows] = await pool.query(sql);
    return rows;
};

export const updateStatusPendaftaran = async (id, status) => {
    const sql = `
        UPDATE pendaftaran
        SET status = ?
        WHERE id = ?
    `;
    const [result] = await pool.query(sql, [status, id]);
    return result;
};
