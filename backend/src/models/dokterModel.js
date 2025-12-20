import pool from "../config/db.js";

export const getAllDokter = async () => {
    const sql = `
    SELECT dokter.*, poli.nama_poli AS nama_poli 
    FROM dokter
    LEFT JOIN poli ON dokter.poli_id = poli.id` // Perbaikan: poli.nama menjadi poli.nama_poli
    const [rows] = await pool.query(sql)
    return rows
}

export const getDokterById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM dokter WHERE id=?", [id])
    return rows[0] // Bagus jika return baris pertama saja
}

export const tambahDokter = async (data) => {
    const {nama, spesialis, poli_id} = data
    const sql = `INSERT INTO dokter (nama, spesialis, poli_id) VALUES(?,?,?)`
    const [result] = await pool.query(sql, [
        nama, spesialis, poli_id
    ])
    return result
}

export const updateDokter = async (id, data) => {
    const {nama, spesialis, poli_id} = data
    // Perbaikan: Hapus koma sebelum WHERE
    const sql = `UPDATE dokter SET nama=?, spesialis=?, poli_id=? WHERE id=?` 
    const [result] = await pool.query(sql, [
        nama, spesialis, poli_id, id
    ])
    return result
}

export const deleteDokter = async (id) => {
    // Perbaikan: Hapus tanda bintang (*) setelah DELETE
    const [result] = await pool.query("DELETE FROM dokter WHERE id=?", [id]) 
    return result
}