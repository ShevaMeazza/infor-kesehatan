import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Pembayaran() {
    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRiwayat = async () => {
        try {
            const res = await api.get("/pendaftaran/riwayat/pembayaran");
            setRiwayat(res.data);
        } catch (err) {
            console.error("Gagal ambil riwayat:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiwayat();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Riwayat Pembayaran (Lunas)</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Nama Pasien</th>
                            <th className="p-4">Total Obat</th>
                            <th className="p-4">Total Tagihan</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riwayat.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="p-4 font-semibold">{item.nama_pasien}</td>
                                <td className="p-4">Rp {item.total_obat.toLocaleString()}</td>
                                <td className="p-4 text-blue-600 font-bold">Rp {item.total_biaya.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {riwayat.length === 0 && !loading && (
                    <p className="p-10 text-center text-gray-500">Belum ada transaksi pembayaran.</p>
                )}
            </div>
        </div>
    );
}