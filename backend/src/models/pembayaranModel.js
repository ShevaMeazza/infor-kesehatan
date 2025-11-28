import pool from "../config/db.js"

export const hitungTotalObat = async (rekam_medis_id) => {
    const sql = `
        SELECT SUM(ro.jumlah * o.harga) AS total
        FROM resep_obat ro
        JOIN obat o ON ro.obat_id = o.id
        WHERE ro.rekam_medis_id = ?
    `
    const [rows] = await pool.query(sql, [rekam_medis_id])
    return rows[0].total || 0
}

export const getBiayaDokter = async (rekam_medis_id) => {
    const sql = `
        SELECT d.harga_dokter
        FROM rekam_medis rm
        JOIN dokter d ON rm.dokter_id = d.id
        WHERE rm.id = ?
    `;

    const [rows] = await pool.query(sql, [rekam_medis_id]);
    return rows[0]?.harga_dokter || 0;
};


export const simpanPembayaran = async ({ rekam_medis_id, total_obat, total_biaya }) => {
    const sql = `
        INSERT INTO pembayaran (rekam_medis_id, total_obat, total_biaya)
        VALUES (?, ?, ?)
    `
    const [result] = await pool.query(sql, [
        rekam_medis_id,
        total_obat,
        total_biaya
    ])

    return result
}

export const getAllPembayaran = async () => {
    const sql = `
        SELECT pb.*, p.nama AS nama_pasien
        FROM pembayaran pb
        JOIN rekam_medis rm ON pb.rekam_medis_id = rm.id
        JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
        JOIN pasien p ON pd.pasien_id = p.id
        ORDER BY pb.tanggal DESC
    `
    const [rows] = await pool.query(sql)
    return rows
}
