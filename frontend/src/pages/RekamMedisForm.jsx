import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function RekamMedisForm() {
    const { id } = useParams() // Ini adalah ID Pendaftaran
    const navigate = useNavigate()

    const [pendaftaran, setPendaftaran] = useState(null)
    const [dokters, setDokters] = useState([])
    const [obatList, setObatList] = useState([])

    const [formData, setFormData] = useState({
        dokter_id: "",
        keluhan: "",
        diagnosa: "",
        tindakan: ""
    })

    const [resep, setResep] = useState([])
    const [selectedObatId, setSelectedObatId] = useState("")
    const [jumlahObat, setJumlahObat] = useState(1)

    useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Ambil data pendaftaran, dokter, dan obat (Data Master)
            const [resPen, resDok, resObat] = await Promise.all([
                api.get(`/pendaftaran/${id}`),
                api.get("/dokter"),
                api.get("/obat")
            ]);
            
            setPendaftaran(resPen.data);
            setDokters(resDok.data);
            setObatList(resObat.data);

            // 2. AMBIL DATA REKAM MEDIS YANG SUDAH PERNAH DIISI
            // Pastikan endpoint ini mengembalikan data diagnosa, tindakan, dll.
            const resRM = await api.get(`/rekam-medis/pendaftaran/${id}`);
            
            if (resRM.data) {
                // INI KUNCINYA: Memasukkan data lama ke dalam State formData
                setFormData({
                    dokter_id: resRM.data.dokter_id || "",
                    keluhan: resRM.data.keluhan || "",
                    diagnosa: resRM.data.diagnosa || "",
                    tindakan: resRM.data.tindakan || ""
                });

                // Masukkan juga daftar obat lama ke dalam tabel resep
                if (resRM.data.resep && resRM.data.resep.length > 0) {
                    setResep(resRM.data.resep);
                }
            } else {
                // Jika RM belum ada, set keluhan default dari pendaftaran
                setFormData(prev => ({...prev, keluhan: resPen.data.keluhan}));
            }
        } catch (err) {
            console.error("Gagal memuat data lama:", err);
        }
    };
    fetchData();
}, [id]);

    const handleAddObat = () => {
        if (!selectedObatId) return
        const obatDetail = obatList.find(o => o.id === parseInt(selectedObatId))

        const exists = resep.find(item => item.obat_id === obatDetail.id)
        if (exists) {
            setResep(resep.map(item =>
                item.obat_id === obatDetail.id ? { ...item, jumlah: item.jumlah + parseInt(jumlahObat) } : item
            ))
        } else {
            setResep([...resep, {
                obat_id: obatDetail.id,
                nama_obat: obatDetail.nama_obat,
                jumlah: parseInt(jumlahObat)
            }])
        }
        setSelectedObatId("")
        setJumlahObat(1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Gunakan metode POST atau PUT sesuai backend kamu
            // Di sini kita asumsikan satu endpoint untuk "Upsert" (Update or Insert)
            await api.post("/rekam-medis", {
                ...formData,
                pendaftaran_id: id,
                resep: resep
            })

            Swal.fire("Berhasil", "Data pemeriksaan berhasil disimpan", "success")
            navigate("/rekam-medis") // Sesuaikan route list kamu
        } catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Error server", "error")
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Form Rekam Medis & Resep</h1>
                <button onClick={() => navigate(-1)} className="text-sm bg-gray-200 px-3 py-1 rounded">Kembali</button>
            </div>

            {pendaftaran && (
                <div className="bg-blue-600 text-white p-5 rounded-t-lg shadow-md grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="opacity-80">Nama Pasien</p>
                        <p className="font-bold text-lg">{pendaftaran.nama_pasien}</p>
                    </div>
                    <div>
                        <p className="opacity-80">NIK / No. RM</p>
                        <p className="font-bold">{pendaftaran.nik || pendaftaran.no_rekam_medis}</p>
                    </div>
                    <div>
                        <p className="opacity-80">Poli Tujuan</p>
                        <p className="font-bold">{pendaftaran.nama_poli}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Pemeriksaan */}
                <div className="bg-white p-6 shadow-sm rounded-b-lg border-x border-b space-y-4">
                    <div className="flex items-center gap-2 font-bold text-blue-600 border-b pb-2 mb-4">
                        <span>📋 Hasil Pemeriksaan Klinis</span>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Dokter Pemeriksa</label>
                        <select
                            className="w-full border p-2.5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            value={formData.dokter_id}
                            onChange={(e) => setFormData({ ...formData, dokter_id: e.target.value })}
                            required
                        >
                            <option value="">-- Pilih Dokter yang Bertugas --</option>
                            {dokters.map(dok => (
                                <option key={dok.id} value={dok.id}>{dok.nama || dok.nama_dokter}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Keluhan Pasien</label>
                        <textarea
                            className="w-full border p-2.5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            rows="2"
                            placeholder="Tuliskan keluhan saat ini..."
                            value={formData.keluhan}
                            required
                            onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Diagnosa (ICD-10)</label>
                            <textarea
                                className="w-full border p-2.5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                                rows="3"
                                placeholder="Analisis penyakit..."
                                value={formData.diagnosa}
                                required
                                onChange={(e) => setFormData({ ...formData, diagnosa: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Tindakan / Plan</label>
                            <textarea
                                className="w-full border p-2.5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                                rows="3"
                                placeholder="Tindakan medis yang dilakukan..."
                                value={formData.tindakan}
                                required
                                onChange={(e) => setFormData({ ...formData, tindakan: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Bagian Resep */}
                <div className="bg-white p-6 shadow-sm rounded-lg border">
                    <div className="flex items-center gap-2 font-bold text-green-600 border-b pb-2 mb-4">
                        <span>💊 Resep Obat (E-Prescription)</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 bg-green-50 p-3 rounded-md">
                        <div className="flex-1 min-w-[200px]">
                            <select
                                className="w-full border p-2 rounded-md"
                                value={selectedObatId}
                                onChange={(e) => setSelectedObatId(e.target.value)}
                            >
                                <option value="">-- Cari Obat --</option>
                                {obatList.map(o => (
                                    <option key={o.id} value={o.id}>{o.nama_obat} (Stok: {o.stok})</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-24">
                            <input
                                type="number"
                                className="w-full border p-2 rounded-md"
                                value={jumlahObat}
                                onChange={(e) => setJumlahObat(e.target.value)}
                                min="1"
                                placeholder="Qty"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddObat}
                            className="bg-green-600 text-white px-6 py-2 rounded-md font-bold hover:bg-green-700 transition"
                        >
                            + Tambah Obat
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left border-b">Nama Farmasi</th>
                                    <th className="p-3 text-center border-b">Jumlah</th>
                                    <th className="p-3 text-center border-b">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resep.length === 0 ? (
                                    <tr><td colSpan="3" className="p-4 text-center text-gray-400 italic">Belum ada obat yang ditambahkan</td></tr>
                                ) : (
                                    resep.map(item => (
                                        <tr key={item.obat_id} className="hover:bg-gray-50 transition">
                                            <td className="p-3 border-b font-medium">{item.nama_obat}</td>
                                            <td className="p-3 border-b text-center">{item.jumlah}</td>
                                            <td className="p-3 border-b text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setResep(resep.filter(i => i.obat_id !== item.obat_id))}
                                                    className="text-red-500 hover:text-red-700 font-semibold"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        💾 Simpan Rekam Medis & Selesaikan Kunjungan
                    </button>
                </div>
            </form>
        </div>
    )
}