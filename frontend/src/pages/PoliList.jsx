import {useState, useEffect} from "react";
import api from "../api/axios";

export default function PoliList() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        api
            .get("/poli")
            .then((res) => {
                if (mounted) setData(res.data)
            })
            .catch((err) => {
                console.error("fetch poli:", err)
                setData([])
            })
            .finally(() => setLoading(false))
        return () => mounted(false)
    }, [])

    if (loading) return <div>Loading...</div>
    if (!data || data.length === 0) return <div>No poli yet</div>

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Daftar Poli</h2>
            <table className="w-full table-auto bg-white shadow rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Nama</th>                        
                    </tr>
                </thead>
                <tbody>
                    {data.map((pol) => (
                        <tr key={pol.id} className="border-t">
                            <td className="p-2">{pol.id}</td>
                            <td className="p-2">{pol.nama_poli}</td>                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}