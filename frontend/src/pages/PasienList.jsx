import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function PasienList() {
    const [pasien, setPasien] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPasien = async () => {
        try {
            const res = await api.get("/pasien")
            setPasien(res.data)
        } catch (err) {
            console.error("Error ambil pasien:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPasien()
    }, [])

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus Pasien?",
            text: "Data pasien akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        })

        if (!confirm.isConfirmed) return

        try {
            await api.delete(`/pasien/${id}`)
            Swal.fire("Berhasil", "Pasien berhasil dihapus!", "success")
            fetchPasien()
        } catch (err) {
            console.error("Detail Error API:", err.response ? err.response.data : err.message);
            Swal.fire("Gagal", "Terjadi kesalahan", "error")
            console.log(err)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Data Pasien</h1>

                <Link
                    to="/pasien/tambah"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + Tambah Pasien
                </Link>
            </div>

            {/* LOADING */}
            {loading && <p>Loading data...</p>}

            {/* NO DATA */}
            {!loading && pasien.length === 0 && (
                <p className="text-gray-500">Belum ada data pasien.</p>
            )}

            {/* TABLE */}
            {!loading && pasien.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow rounded-lg">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-left">NIK</th>
                                <th className="p-3 text-left">No HP</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pasien.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{p.id}</td>
                                    <td className="p-3">{p.nama}</td>
                                    <td className="p-3">{p.nik}</td>
                                    <td className="p-3">{p.no_hp}</td>

                                    <td className="p-3 flex gap-2">
                                        <Link
                                            to={`/pasien/edit/${p.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
