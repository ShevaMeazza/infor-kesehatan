import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";

export default function EditRekamMedis() {
    const { id } = useParams(); // ID Pendaftaran
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pendaftaran, setPendaftaran] = useState(null);
    const [obatList, setObatList] = useState([]); // Master data obat
    const [rekamMedisId, setRekamMedisId] = useState(null);

    const [formRM, setFormRM] = useState({
        diagnosa: "",
        tindakan: "",
    });

    const [formObat, setFormObat] = useState({
        obat_id: "",
        jumlah: 1,
    });

    const [resepTerpilih, setResepTerpilih] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil detail pendaftaran & master obat
                const [resPendaftaran, resObat] = await Promise.all([
                    api.get(`/pendaftaran/${id}`),
                    api.get("/obat")
                ]);
                setPendaftaran(resPendaftaran.data);
                setObatList(resObat.data);
                
                // Jika sudah ada rekam_medis_id di data pendaftaran, ambil datanya
                if (resPendaftaran.data.rekam_medis_id) {
                    setRekamMedisId(resPendaftaran.data.rekam_medis_id);
                    // Ambil detail RM jika perlu (opsional)
                }
                setLoading(false);
            } catch (err) {
                Swal.fire("Error", "Gagal mengambil data", "error");
            }
        };
        fetchData();
    }, [id]);

    const handleSimpanRM = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/rekam-medis", {
                pendaftaran_id: id,
                diagnosa: formRM.diagnosa,
                tindakan: formRM.tindakan,
            });
            setRekamMedisId(res.data.id);
            Swal.fire("Berhasil", "Data Rekam Medis Disimpan", "success");
        } catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Gagal simpan RM", "error");
        }
    };

    const handleTambahObat = async (e) => {
        e.preventDefault();
        if (!rekamMedisId) return Swal.fire("Peringatan", "Simpan Rekam Medis dulu!", "warning");

        try {
            await api.post("/resep-obat", {
                rekam_medis_id: rekamMedisId,
                obat_id: formObat.obat_id,
                jumlah: formObat.jumlah
            });
            
            // Update list tampilan sementara (atau fetch ulang dari server)
            const obatDetail = obatList.find(o => o.id == formObat.obat_id);
            setResepTerpilih([...resepTerpilih, { ...obatDetail, jumlah: formObat.jumlah }]);
            
            Swal.fire("Berhasil", "Obat ditambahkan", "success");
        } catch (err) {
            Swal.fire("Gagal", "Gagal tambah obat", "error");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">Pemeriksaan Pasien: {pendaftaran?.nama_pasien}</h2>
            <p className="text-gray-600 mb-6">Poli: {pendaftaran?.nama_poli} | Antrian: {pendaftaran?.no_antrian}</p>

            <hr className="mb-6" />

            {/* Form Rekam Medis */}
            <form onSubmit={handleSimpanRM} className="space-y-4 mb-10">
                <h3 className="font-semibold text-lg">1. Diagnosa & Tindakan</h3>
                <textarea
                    placeholder="Diagnosa Dokter"
                    className="w-full border p-2 rounded"
                    rows="3"
                    value={formRM.diagnosa}
                    onChange={(e) => setFormRM({ ...formRM, diagnosa: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Tindakan / Saran"
                    className="w-full border p-2 rounded"
                    rows="2"
                    value={formRM.tindakan}
                    onChange={(e) => setFormRM({ ...formRM, tindakan: e.target.value })}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Simpan Rekam Medis
                </button>
            </form>

            {/* Form Tambah Obat */}
            <div className={`space-y-4 ${!rekamMedisId ? "opacity-50 pointer-events-none" : ""}`}>
                <h3 className="font-semibold text-lg">2. Resep Obat</h3>
                <div className="flex gap-2">
                    <select
                        className="flex-1 border p-2 rounded"
                        value={formObat.obat_id}
                        onChange={(e) => setFormObat({ ...formObat, obat_id: e.target.value })}
                    >
                        <option value="">-- Pilih Obat --</option>
                        {obatList.map(o => (
                            <option key={o.id} value={o.id}>{o.nama_obat} (Stok: {o.stok})</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="w-20 border p-2 rounded"
                        value={formObat.jumlah}
                        onChange={(e) => setFormObat({ ...formObat, jumlah: e.target.value })}
                        min="1"
                    />
                    <button onClick={handleTambahObat} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Tambah
                    </button>
                </div>

                {/* Tabel Resep Sementara */}
                <table className="w-full mt-4 border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Nama Obat</th>
                            <th className="border p-2">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resepTerpilih.map((item, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{item.nama_obat}</td>
                                <td className="border p-2 text-center">{item.jumlah}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button 
                onClick={() => nav("/pendaftaran-list")}
                className="mt-10 w-full border border-gray-400 p-2 rounded hover:bg-gray-100"
            >
                Kembali ke Daftar Antrian
            </button>
        </div>
    );
}