import pool from "../config/db.js"

export const getNextAntrian = async (poli_id) => {
    const sql = `SELECT COUNT(*) AS total FROM pendaftaran WHERE poli_id = ? AND tanggal = CURDATE()`
    const [rows] = await pool.query(sql, [poli_id])
    const total = rows[0]?.total ?? 0
    return total + 1
}

export const tambahPendaftaran = async ({ pasien_id, poli_id }) => {
    const no_antrian = await getNextAntrian(poli_id)

    const sql = `
    INSERT INTO pendaftaran (pasien_id, poli_id, tanggal, status, no_antrian)
    VALUES (?, ?, CURDATE(), 'menunggu', ?)`
    const [result] = await pool.query(sql, [pasien_id, poli_id, no_antrian])

    return { insertId: result.insertId, no_antrian }
}

export const getAllPendaftaran = async () => {
    const sql = `
    SELECT p.*, pa.nama AS nama_pasien, po.nama_poli
    FROM pendaftaran p
    JOIN pasien pa ON p.pasien_id = pa.id
    JOIN poli po ON p.poli_id = po.id
    ORDER BY p.tanggal DESC, p.no_antrian ASC`
    const [rows] = await pool.query(sql)
    return rows
}

export const getPendaftaranById = async (id) => {
    const sql = `
    SELECT p.*, pa.nama AS nama_pasien, po.nama_poli
    FROM pendaftaran p
    JOIN pasien pa ON p.pasien_id = pa.id
    JOIN poli po ON p.poli_id = po.id
    WHERE p.id = ?`
    const [rows] = await pool.query(sql, [id])
    return rows.length ? rows[0] : null
}

export const updateStatusPendaftaran = async (id, status) => {
    const sql = `UPDATE pendaftaran SET status = ? WHERE id = ?`
    const [result] = await pool.query(sql, [status, id])
    return result
}

export const deletePendaftaran = async (id) => {
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()
        
        const [rmRows] = await connection.query(
            "SELECT id FROM rekam_medis WHERE pendaftaran_id = ?",
            [id]
        )

        if (rmRows.length > 0) {
            const rmIds = rmRows.map(row => row.id)
            
            await connection.query("DELETE FROM resep_obat WHERE rekam_medis_id IN (?)", [rmIds])
            await connection.query("DELETE FROM pembayaran WHERE rekam_medis_id IN (?)", [rmIds])
            
            await connection.query("DELETE FROM rekam_medis WHERE pendaftaran_id = ?", [id])
        }
        
        const [result] = await connection.query("DELETE FROM pendaftaran WHERE id = ?", [id])

        await connection.commit()
        return result
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}