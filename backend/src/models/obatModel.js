import pool from "../config/db.js"

export const getAllObat = async () => {
    const sql = "SELECT * FROM obat"
    const [rows] = await pool.query(sql)
    return rows
}

export const tambahObat = async ({ nama_obat, stok, harga, deskripsi }) => {
    const sql = `
        INSERT INTO obat (nama_obat, stok, harga, deskripsi)
        VALUES (?, ?, ?, ?)
    `
    const [result] = await pool.query(sql, [
        nama_obat, stok, harga, deskripsi
    ])
    return result
}

export const updateObat = async (id, { nama_obat, stok, harga, deskripsi }) => {
    const sql = `
        UPDATE obat 
        SET nama_obat = ?, stok = ?, harga = ?, deskripsi = ?
        WHERE id = ?
    `
    const [result] = await pool.query(sql, [
        nama_obat, stok, harga, deskripsi, id
    ])
    return result
}

export const deleteObat = async (id) => {
    const sql = "DELETE FROM obat WHERE id = ?"
    const [result] = await pool.query(sql, [id])
    return result
}
