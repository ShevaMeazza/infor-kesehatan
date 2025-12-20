import pool from "../config/db.js"

export const getAllPasien = async () => {
    const [rows] = await pool.query("SELECT * FROM pasien")
    return rows
}

export const getPasienById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM pasien WHERE id = ?", [id])
    return rows[0]
}

export const tambahPasien = async ({ nama, nik, tanggal_lahir, alamat, no_hp }) => {
    const sql = `
        INSERT INTO pasien (nama, nik, tanggal_lahir, alamat, no_hp)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
        nama, nik, tanggal_lahir, alamat, no_hp
    ]);
    return result; // ← WAJIB return result, bukan rows
};


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
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const [pendaftaranRows] = await connection.query("SELECT id FROM pendaftaran WHERE pasien_id = ?", [id]);
        
        if (pendaftaranRows.length > 0) {
            const pendaftaranIds = pendaftaranRows.map(row => row.id);
            
            await connection.query(`
                DELETE resep_obat 
                FROM resep_obat 
                JOIN rekam_medis ON resep_obat.rekam_medis_id = rekam_medis.id
                WHERE rekam_medis.pendaftaran_id IN (?)
            `, [pendaftaranIds]);
                        
            await connection.query(`
                DELETE pembayaran 
                FROM pembayaran 
                JOIN rekam_medis ON pembayaran.rekam_medis_id = rekam_medis.id
                WHERE rekam_medis.pendaftaran_id IN (?)
            `, [pendaftaranIds]);
            
            await connection.query(`DELETE FROM rekam_medis WHERE pendaftaran_id IN (?)`, [pendaftaranIds]);
        }                
        
        await connection.query("DELETE FROM kunjungan WHERE pasien_id=?", [id]);
        
        await connection.query("DELETE FROM pendaftaran WHERE pasien_id=?", [id]);
                
        const [result] = await connection.query("DELETE FROM pasien WHERE id=?", [id]);
        
        await connection.commit(); 
        
        return result;
    } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
        throw error;
    } finally {
        connection.release();
    }
}
