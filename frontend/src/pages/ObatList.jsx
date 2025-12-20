import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function ObatList() {
    const [obat, setObat] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchObat = async () => {
        try {
            const res = await api.get("/obat")
            setObat(res.data)
        } catch (err) {
            console.error("Error ambil obat:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchObat()
    }, [])
    

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Data Obat</h1>

                <Link
                    to="/obat/tambah"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + Tambah Obat
                </Link>
            </div>

            {/* LOADING */}
            {loading && <p>Loading data...</p>}

            {/* NO DATA */}
            {!loading && obat.length === 0 && (
                <p className="text-gray-500">Belum ada data obat.</p>
            )}

            {/* TABLE */}
            {!loading && obat.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow rounded-lg">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nama Obat</th>
                                <th className="p-3 text-left">Stok Obat</th>
                                <th className="p-3 text-left">Harga Obat</th>
                                <th className="p-3 text-left">Deskripsi Obat</th>                                
                            </tr>
                        </thead>
                        <tbody>
                            {obat.map((ob) => (
                                <tr key={ob.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{ob.id}</td>
                                    <td className="p-3">{ob.nama_obat}</td>
                                    <td className="p-3">{ob.stok}</td>
                                    <td className="p-3">{ob.harga}</td>
                                    <td className="p-3">{ob.deskripsi}</td>                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
