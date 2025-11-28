import pool from "../config/db.js"

export const getAllPasien = async () => {
    const [rows] = await pool.query("SELECT * FROM pasien")
    return rows
}

export const getPasienById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM pasien WHERE id = ?", [id])
    return rows[0]
}

export const tambahPasien = async (data) => {
    const { nama, nik, tanggal_lahir, alamat, no_hp } = data
    const sql = ` INSERT INTO pasien (nama, nik, tanggal_lahir, alamat, no_hp) VALUES (?, ?, ?, ?, ?)`
    const [result] = await pool.query(sql, [
        nama,
        nik,
        tanggal_lahir,
        alamat,
        no_hp,
    ])
    return result
}

export const updatePasien = async (id, data) => {
    const { nama, nik, tanggal_lahir, alamat, no_hp } = data
    const sql = ` UPDATE pasien SET nama=?, nik=?, tanggal_lahir=?, alamat=?, no_hp=? WHERE id=? `
    const [result] = await pool.query(sql, [
        nama,
        nik,
        tanggal_lahir,
        alamat,
        no_hp,
        id,
    ])
    return result
}

export const deletePasien = async (id) => {
    const [result] = await pool.query("DELETE FROM pasien WHERE id=?", [id])
    return result
}
