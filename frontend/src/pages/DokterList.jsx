import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Dokter() {
    const [dokter, setDokter] = useState([]);
    const [poli, setPoli] = useState([]);
    const [form, setForm] = useState({ nama: "", spesialis: "", harga_dokter: "", poli_id: "" });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [resDokter, resPoli] = await Promise.all([
                api.get("/dokter"),
                api.get("/poli")
            ]);
            setDokter(resDokter.data);
            setPoli(resPoli.data);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/dokter", form);
            Swal.fire("Berhasil", "Data dokter telah disimpan", "success");
            setForm({ nama: "", spesialis: "", harga_dokter: "", poli_id: "" });
            fetchData();
        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan", "error");
        }
    };

    const handleHapus = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Dokter?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/dokter/${id}`);
                fetchData();
                Swal.fire("Terhapus!", "Data dokter berhasil dihapus", "success");
            } catch (err) {
                Swal.fire("Gagal", "Dokter ini mungkin masih terikat dengan data rekam medis", "error");
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Master Dokter</h1>

            {/* Form Tambah Dokter */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-blue-600">Tambah Dokter Baru</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input 
                        className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Nama Lengkap" 
                        value={form.nama}
                        onChange={(e) => setForm({...form, nama: e.target.value})}
                        required 
                    />
                    <input 
                        className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Spesialis (ex: Gigi, Anak)" 
                        value={form.spesialis}
                        onChange={(e) => setForm({...form, spesialis: e.target.value})}
                        required 
                    />
                    <select 
                        className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={form.poli_id}
                        onChange={(e) => setForm({...form, poli_id: e.target.value})}
                        required
                    >
                        <option value="">-- Pilih Poli --</option>
                        {poli.map(p => (
                            <option key={p.id} value={p.id}>{p.nama_poli}</option>
                        ))}
                    </select>
                    <input 
                        type="number"
                        className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Biaya Jasa (Rp)" 
                        value={form.harga_dokter}
                        onChange={(e) => setForm({...form, harga_dokter: e.target.value})}
                        required 
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition duration-200">
                        Simpan Dokter
                    </button>
                </form>
            </div>

            {/* Tabel Dokter */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                            <th className="p-4 border-b">Nama Dokter</th>
                            <th className="p-4 border-b">Poli</th>
                            <th className="p-4 border-b">Biaya Jasa</th>
                            <th className="p-4 border-b text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dokter.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 border-b font-medium">
                                    {d.nama} <br />
                                    <span className="text-xs text-gray-400 font-normal">{d.spesialis}</span>
                                </td>
                                <td className="p-4 border-b">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        {d.nama_poli || "Umum"}
                                    </span>
                                </td>
                                <td className="p-4 border-b text-green-600 font-semibold">
                                    Rp {Number(d.harga_dokter).toLocaleString('id-ID')}
                                </td>
                                <td className="p-4 border-b text-center">
                                    <button 
                                        onClick={() => handleHapus(d.id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm p-2"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {dokter.length === 0 && !loading && (
                    <div className="p-10 text-center text-gray-400">Belum ada data dokter.</div>
                )}
            </div>
        </div>
    );
}