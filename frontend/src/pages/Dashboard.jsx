import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, menunggu: 0, pemeriksaan: 0, farmasi: 0, selesai: 0 });
    const [todayList, setTodayList] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {                
                const resStats = await api.get("/pendaftaran/stats");
                console.log("Data Stats:", resStats.data);
                setStats(resStats.data);

                const resList = await api.get("/pendaftaran");
                setTodayList(resList.data);

            } catch (err) {                
                console.error("Gagal ambil data dashboard:", err);
            }
        };
        fetchDashboardData();
    }, []);

    const cards = [
        { label: "Total Pasien", value: stats.total, color: "bg-blue-500", icon: "👥" },
        { label: "Menunggu", value: stats.menunggu, color: "bg-yellow-500", icon: "⏳" },
        { label: "Diperiksa", value: stats.pemeriksaan, color: "bg-purple-500", icon: "🩺" },
        { label: "Ke Kasir", value: stats.farmasi, color: "bg-orange-500", icon: "💊" },
        { label: "Selesai", value: stats.selesai, color: "bg-green-500", icon: "✅" },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Dashboard Klinik 🏥</h1>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
                {cards.map((card, i) => (
                    <div key={i} className={`${card.color} text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-lg`}>
                        <div className="flex justify-between items-center gap-2">
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm opacity-80 uppercase font-bold truncate">{card.label}</p>
                                <p className="text-2xl sm:text-3xl font-black">{card.value || 0}</p>
                            </div>
                            <span className="text-2xl sm:text-3xl flex-shrink-0">{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* QUICK ACTIONS & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Antrian Sekarang */}
                <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-3 sm:p-4 border-b bg-gray-50 flex justify-between items-center gap-2">
                        <h2 className="font-bold text-sm sm:text-base text-gray-700">Aktivitas Antrian Hari Ini</h2>
                        <Link to="/antrian-admin" className="text-blue-600 text-xs sm:text-sm hover:underline whitespace-nowrap">Lihat Semua</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="p-2 sm:p-4">Antrian No</th>
                                    <th className="p-2 sm:p-4">Pasien</th>
                                    <th className="p-2 sm:p-4">Poli</th>
                                    <th className="p-2 sm:p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-xs sm:text-sm">
                                {todayList.slice(0, 5).map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-2 sm:p-4 font-bold">#{p.no_antrian}</td>
                                        <td className="p-2 sm:p-4">{p.nama_pasien}</td>
                                        <td className="p-2 sm:p-4 text-gray-500">{p.nama_poli}</td>
                                        <td className="p-2 sm:p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tombol Cepat */}
                <div className="space-y-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
                        <h2 className="font-bold mb-4 text-sm sm:text-base text-gray-700">Akses Cepat</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <Link to="/pendaftaran" className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm">
                                <span className="mr-3">📝</span> Pendaftaran
                            </Link>
                            <Link to="/obat" className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm">
                                <span className="mr-3">💊</span> Obat
                            </Link>
                            <Link to="/dokter" className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm">
                                <span className="mr-3">🩺</span> Dokter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}