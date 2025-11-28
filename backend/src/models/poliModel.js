import pool from "../config/db.js";

export const getAllPoli = async () => {
    const [rows] = await pool.query("SELECT * FROM poli")
    return rows
}

export const tambahPoli = async (nama) => {
    const sql = `INSERT INTO poli (nama) VALUES (?)`
    const [result]= await pool.query(sql, [nama])
    return result
}

export const updatePoli = async (id, nama) => {
    const sql = `UPDATE poli SET nama=? WHERE id=?`
    const [result] = await pool.query(sql, [nama, id])
    return result
}

export const deletePoli = async (id) => {
    const sql = `DELETE * FROM poli WHERE id=?`
    const [result] = await pool.query(sql, [id])
    return result
}
