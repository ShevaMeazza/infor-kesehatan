import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function RekamMedisForm() {
    const { id } = useParams()
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
                const [resPen, resDok, resObat] = await Promise.all([
                    api.get(`/pendaftaran/${id}`),
                    api.get("/dokter"),
                    api.get("/obat")
                ])
                setPendaftaran(resPen.data)
                setDokters(resDok.data)
                setObatList(resObat.data)
            } catch (err) {
                console.error("Gagal memuat data:", err)
            }
        }
        fetchData()
    }, [id])

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
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post("/rekam-medis", {
                ...formData,
                pendaftaran_id: id,
                resep: resep
            })
            
            Swal.fire("Berhasil", "Data pemeriksaan disimpan", "success")
            navigate("/rekam-medis") 
        } catch (err) {
            Swal.fire("Gagal", err.response?.data?.message || "Error server", "error")
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Form Rekam Medis</h1>
            
            {pendaftaran && (
                <div className="bg-blue-50 p-4 rounded-lg border mb-6 grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Pasien:</strong> {pendaftaran.nama_pasien}</p>
                    <p><strong>No RM:</strong> {pendaftaran.no_rekam_medis}</p>
                    <p><strong>Keluhan Awal:</strong> {pendaftaran.keluhan}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 shadow rounded-lg border space-y-4">
                    <h3 className="font-bold border-b pb-2">Hasil Pemeriksaan</h3>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Dokter Pemeriksa</label>
                        <select 
                            className="w-full border p-2 rounded"
                            value={formData.dokter_id}
                            onChange={(e) => setFormData({...formData, dokter_id: e.target.value})}
                            required
                        >
                            <option value="">-- Pilih Dokter --</option>                            
                            {dokters.map(dok => (
                                <option key={dok.id} value={dok.id}>{dok.nama || dok.nama_dokter}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Keluhan</label>
                        <textarea className="w-full border p-2 rounded" required
                            onChange={(e) => setFormData({...formData, keluhan: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Diagnosa</label>
                            <textarea className="w-full border p-2 rounded" required
                                onChange={(e) => setFormData({...formData, diagnosa: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tindakan</label>
                            <textarea className="w-full border p-2 rounded" required
                                onChange={(e) => setFormData({...formData, tindakan: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 shadow rounded-lg border">
                    <h3 className="font-bold mb-4 border-b pb-2">Resep Obat</h3>
                    <div className="flex gap-2 mb-4">
                        <select className="flex-1 border p-2 rounded" value={selectedObatId} onChange={(e) => setSelectedObatId(e.target.value)}>
                            <option value="">-- Pilih Obat --</option>
                            {obatList.map(o => (
                                <option key={o.id} value={o.id}>{o.nama_obat} (Stok: {o.stok})</option>
                            ))}
                        </select>
                        <input type="number" className="w-20 border p-2 rounded" value={jumlahObat} onChange={(e) => setJumlahObat(e.target.value)} min="1" />
                        <button type="button" onClick={handleAddObat} className="bg-green-600 text-white px-4 py-2 rounded">Tambah</button>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr><th className="p-2 text-left">Nama Obat</th><th className="p-2 text-left">Jumlah</th><th className="p-2">Aksi</th></tr>
                        </thead>
                        <tbody>
                            {resep.map(item => (
                                <tr key={item.obat_id} className="border-b">
                                    <td className="p-2">{item.nama_obat}</td>
                                    <td className="p-2">{item.jumlah}</td>
                                    <td className="p-2 text-center">
                                        <button type="button" onClick={() => setResep(resep.filter(i => i.obat_id !== item.obat_id))} className="text-red-500">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                    Simpan Rekam Medis & Selesai
                </button>
            </form>
        </div>
    )
}