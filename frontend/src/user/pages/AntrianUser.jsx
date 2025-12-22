import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../api/axios"

export default function AntrianUser() {
    const { id } = useParams()
    const nav = useNavigate()
    const [data, setData] = useState(null)

    const fetchData = async () => {
        try {
            const res = await api.get(`/pendaftaran/${id}`)
            setData(res.data)

            const currentStatus = res.data.status.toLowerCase()

            if (currentStatus === "dipanggil") {
                console.log("Pasien Dipanggil")
            }

            if (currentStatus === "menunggu pembayaran") {
                console.log("mengalihkan ke pembayaran")
                nav(`/pembayaran-pasien/${id}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
    
    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 3000)
        return () => clearInterval(interval)
    }, [])

    if (!data) return <p className="p-10">Loading...</p>

    const statusColor = {
        "menunggu": "bg-yellow-100 text-yellow-700",
        "dipanggil": "bg-blue-100 text-blue-700",            
        "pemeriksaan": "bg-purple-100 text-purple-700",
        "menunggu pembayaran": "bg-orange-100 text-orange-700",
        "selesai": "bg-green-100 text-green-700"
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg text-center border border-green-200">
                
                <h1 className="text-3xl font-bold mb-2 text-green-700">
                    Pendaftaran Berhasil 🎉
                </h1>

                <p className="text-gray-600 mb-6">
                    Berikut adalah detail antrian Anda.
                </p>

                {/* NOMOR ANTRIAN */}
                <div className="text-7xl font-extrabold text-green-800 tracking-wider my-6">
                    {data.no_antrian}
                </div>

                {/* STATUS */}
                <p className={`inline-block px-4 py-2 rounded-full text-lg font-semibold mb-6 ${statusColor[data.status]}`}>
                    Status: {data.status.toUpperCase()}
                </p>

                {/* DETAIL */}
                <div className="text-left mt-4 space-y-3 text-gray-700">
                    <p><b>Nama Pasien:</b> {data.nama_pasien}</p>
                    <p><b>Poli Tujuan:</b> {data.nama_poli}</p>
                    <p><b>Tanggal:</b> {new Date(data.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <p className="mt-8 text-gray-500 italic">
                    Harap menunggu hingga nomor Anda dipanggil 🙏
                </p>
            </div>
        </div>
    )
}
