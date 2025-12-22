import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function TambahObat() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        nama_obat: "",
        stok: "",
        harga: "",
        deskripsi: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await api.post("/obat", form)
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data obat berhasil ditambahkan!',
                timer: 2000,
                showConfirmButton: false
            })

            navigate("/obat") // Kembali ke daftar obat
        } catch (err) {
            console.error("Gagal tambah obat:", err)
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan server", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tambah Obat Baru</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-gray-500 hover:text-gray-700 transition"
                >
                    Kembali
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama Obat */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Obat</label>
                    <input
                        type="text"
                        name="nama_obat"
                        required
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                        placeholder="Contoh: Paracetamol 500mg"
                        value={form.nama_obat}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Stok */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Stok Obat</label>
                        <input
                            type="number"
                            name="stok"
                            required
                            min="0"
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="0"
                            value={form.stok}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Harga */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Satuan (Rp)</label>
                        <input
                            type="number"
                            name="harga"
                            required
                            min="0"
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Contoh: 5000"
                            value={form.harga}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Obat</label>
                    <textarea
                        name="deskripsi"
                        rows="4"
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="Kegunaan obat, aturan pakai, dll..."
                        value={form.deskripsi}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                        loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95"
                    }`}
                >
                    {loading ? "Menyimpan..." : "Simpan Data Obat"}
                </button>
            </form>
        </div>
    )
}