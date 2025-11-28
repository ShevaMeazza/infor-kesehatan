import  pool  from "../config/db.js";

export const getAllDokter = async () => {
    const sql = `
    SELECT dokter.*, poli.nama AS poli
    FROM dokter
    LEFT JOIN poli ON dokter.poli_id = poli.id`
    const [rows] = await pool.query(sql)
    return rows
}

export const getDokterById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM dokter WHERE id=?", [id])
    return rows
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
    const sql = `UPDATE dokter 
    SET nama=?, spesialis=?, poli_id=?,
    WHERE id=?`
    const [result] = await pool.query(sql, [
        nama, spesialis, poli_id, id
    ])
    return result
}

export const deleteDokter = async (id) => {
    const [result] = await pool.query("DELETE * FROM dokter WHERE id=?", [id])
    return result
}