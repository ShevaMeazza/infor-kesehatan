import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function Pendaftaran() {
    const [pendaftaran, setPendaftaran] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPendaftaran = async () => {
        try {
            const res = await api.get("/pendaftaran")
            setPendaftaran(res.data)
        } catch (err) {
            console.error("Error ambil pendaftaran:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPendaftaran()
    }, [])

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus Pendaftaran?",
            text: "Data ini akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        })

        if (!confirm.isConfirmed) return

        try {
            await api.delete(`/pendaftaran/${id}`)
            Swal.fire("Berhasil", "Pendaftaran berhasil dihapus!", "success")
            fetchPendaftaran()
        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan", "error")
            console.log(err)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Data Pendaftaran</h1>
            </div>

            {loading && <p>Loading data...</p>}

            {!loading && pendaftaran.length === 0 && (
                <p className="text-gray-500">Belum ada data pendaftaran.</p>
            )}

            {!loading && pendaftaran.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow rounded-lg">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Pasien ID</th>
                                <th className="p-3 text-left">Poli ID</th>
                                <th className="p-3 text-left">Tanggal</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">No Antrian</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendaftaran.map((pen) => (
                                <tr key={pen.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{pen.id}</td>
                                    <td className="p-3">{pen.pasien_id}</td>
                                    <td className="p-3">{pen.poli_id}</td>
                                    <td className="p-3">{pen.tanggal}</td>
                                    <td className="p-3">{pen.status}</td>
                                    <td className="p-3">{pen.no_antrian}</td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => handleDelete(pen.id)}
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
