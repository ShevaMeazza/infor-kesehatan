import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function RekamMedisList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get("/rekam-medis");
            console.log("Response data:", res.data);
            setData(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch (err) {
            console.error("Gagal mengambil rekam medis:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Data Rekam Medis</h1>

            {data.length === 0 ? (
                <p className="text-gray-500">Belum ada rekam medis.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full shadow bg-white rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Pendaftaran Id</th>
                                <th className="p-3 text-left">Dokter Id</th>
                                <th className="p-3 text-left">Keluhan</th>
                                <th className="p-3 text-left">Diagnosa</th>
                                <th className="p-3 text-left">Tindakan</th>
                                <th className="p-3 text-left">Tanggal</th>
                                {/* <th className="p-3 text-left">Aksi</th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((rm) => (
                                <tr key={rm.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{rm.id}</td>
                                    <td className="p-3">{rm.pendaftaran_id}</td>
                                    <td className="p-3">{rm.dokter_id}</td>
                                    <td className="p-3">{rm.keluhan}</td>
                                    <td className="p-3">{rm.diagnosa}</td>
                                    <td className="p-3">{rm.tindakan}</td>
                                    <td className="p-3">{new Date(rm.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>                                    
                                    {/* <td className="p-3">
                                        <Link
                                            to={`/rekam-medis/${rm.id}`}
                                            className="text-yellow-300 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}
