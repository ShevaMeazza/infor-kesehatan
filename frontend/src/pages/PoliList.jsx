import { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Poli() {
    const [poli, setPoli] = useState([]);
    const [namaPoli, setNamaPoli] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPoli = async () => {
        try {
            setLoading(true);
            const res = await api.get("/poli");
            setPoli(res.data);
        } catch (err) {
            console.error("Gagal mengambil data poli:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoli();
    }, []);

    const handleTambah = async (e) => {
        e.preventDefault();
        try {
            await api.post("/poli", { nama_poli: namaPoli });
            setNamaPoli("");
            fetchPoli();
            Swal.fire({
                title: "Berhasil!",
                text: "Poli baru telah ditambahkan",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan saat menambah poli", "error");
        }
    };

    const handleHapus = async (id) => {
        const result = await Swal.fire({
            title: "Hapus Poli?",
            text: "Peringatan: Menghapus poli dapat mempengaruhi data dokter yang terikat!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        });
        try {            
            console.log("Menghapus Poli ID:", id);
            
            await api.delete(`/poli/${id}`);

            fetchPoli();
        } catch (err) {
            console.log(err.response.data);
        }

        if (result.isConfirmed) {
            try {
                await api.delete(`/poli/${id}`);
                fetchPoli();
                Swal.fire("Terhapus!", "Data poli berhasil dihapus", "success");
            } catch (err) {
                Swal.fire("Gagal", "Poli tidak bisa dihapus karena masih digunakan", "error");
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Master Poli</h1>

            {/* Form Tambah Poli */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-green-600">Tambah Poli Baru</h2>
                <form onSubmit={handleTambah} className="flex gap-4">
                    <input
                        className="border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none flex-1"
                        placeholder="Contoh: Poli Gigi, Poli Anak, Umum"
                        value={namaPoli}
                        onChange={(e) => setNamaPoli(e.target.value)}
                        required
                    />
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg transition duration-200">
                        Tambah Poli
                    </button>
                </form>
            </div>

            {/* Tabel Poli */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                            <th className="p-4 border-b w-20">No</th>
                            <th className="p-4 border-b text-left">Nama Poli</th>
                            <th className="p-4 border-b text-center w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {poli.map((p, index) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 border-b text-gray-500">{index + 1}</td>
                                <td className="p-4 border-b font-medium text-gray-800">
                                    {p.nama_poli}
                                </td>
                                <td className="p-4 border-b text-center">
                                    <button
                                        onClick={() => handleHapus(p.id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm p-2"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {poli.length === 0 && !loading && (
                    <div className="p-10 text-center text-gray-400">Belum ada data poli.</div>
                )}
            </div>
        </div>
    );
}