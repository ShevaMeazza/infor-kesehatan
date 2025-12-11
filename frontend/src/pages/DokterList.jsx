import React, {useEffect, useState} from "react";
import api from "../api/axios";

export default function DokterList() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        api
            .get("/dokter")
            .then((res) => {
                if(mounted) setData(res.data)
            })
            .catch((err) => {
                console.error("fetch dokter:", err)
                setData([])
            })
            .finally(() => setLoading(false))
        return () => (mounted = false)
    }, [])

    if (loading) return <div>Loading...</div>
    if (!data || data.length === 0) return <div>No dokter yet</div>

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Daftar Dokter</h2>
            <table className="w-full table-auto bg-white shadow rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Nama</th>
                        <th className="p-2 text-left">Spesialis</th>                        
                        <th className="p-2 text-left">Harga Dokter</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.id} className="border-t">
                            <td className="p-2">{d.id}</td>
                            <td className="p-2">{d.nama}</td>
                            <td className="p-2">{d.spesialis}</td>                            
                            <td className="p-2">{d.harga_dokter}</td>      
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}