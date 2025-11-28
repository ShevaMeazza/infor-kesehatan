import pool from "../config/db.js"

export const tambahResep = async ({rekam_medis_id, obat_id, jumlah}) => {
    const sql = `
    INSERT INTO resep_obat ( rekam_medis_id, obat_id, jumlah )
    VALUES (?,?,?) 
    `

    const [result] = await pool.query(sql, [
        rekam_medis_id,
        obat_id,
        jumlah
    ])
    return result
}

export const getResepByRekamMedis = async (rekam_medis_id) => {
    const sql = `
        SELECT ro.*, o.nama_obat, o.harga
        FROM resep_obat ro
        JOIN obat o ON ro.obat_id = o.id
        WHERE ro.rekam_medis_id = ?
    `

    const [rows] = await pool.query(sql, [rekam_medis_id])
    return rows
}

export const hapusResep = async (id) => {
    const sql = "DELETE FROM resep_obat WHERE id=?"
    const [rows] = await pool.query(sql, [id])
    return rows
}

export const kurangiStok = async (obat_id, jumlah) => {
    const sql = `
        UPDATE obat 
        SET stok = stok - ?
        WHERE id = ? AND stok >= ?
    `

    const [result] = await pool.query(sql, [jumlah, obat_id, jumlah])
    return result
}

export const cekStok = async (obat_id) => {
    const sql = "SELECT stok FROM obat WHERE id = ?"
    const [rows] = await pool.query(sql, [obat_id])
    return rows[0]
}
