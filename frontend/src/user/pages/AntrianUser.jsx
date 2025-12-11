import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function AntrianUser() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/pendaftaran/${id}`).then((res) => setData(res.data));
    }, [id]);

    if (!data) return <p className="p-10">Loading...</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-6">

            <h1 className="text-3xl font-bold mb-4 text-green-700">
                Pendaftaran Berhasil 🎉
            </h1>

            <p className="text-xl">Nomor Antrian Anda:</p>

            <div className="text-6xl font-bold text-green-800 my-6">
                {data.nomor_antrian}
            </div>

            <p className="text-gray-700">Silakan tunggu hingga nomor Anda dipanggil.</p>
        </div>
    );
}
