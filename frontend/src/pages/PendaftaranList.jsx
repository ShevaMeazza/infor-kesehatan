import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function Pendaftaran() {
    const navigate = useNavigate()

    const [editId, setEditId] = useState(null)
    const [newStatus, setNewStatus] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [pendaftaran, setPendaftaran] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPendaftaran = async () => {
        try {
            const res = await api.get("/pendaftaran")
            setPendaftaran(res.data)
        } catch (err) {
            console.error("Error ambil pendaftaran:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPendaftaran()
    }, [])

    const StatusBadge = ({ status }) => {
        const s = status ? status.toLowerCase() : ""

        const colors = {
            "menunggu": "bg-yellow-100 text-yellow-700",
            "dipanggil": "bg-blue-100 text-blue-700",
            "pemeriksaan": "bg-purple-100 text-purple-700",
            "menunggu pembayaran": "bg-orange-100 text-orange-700",
            "selesai": "bg-green-100 text-green-700"
        }

        const activeColor = colors[s] || "bg-gray-100 text-gray-700"

        return (
            <span className={`px-3 py-1 rounded text-xs font-medium uppercase tracking-wider ${activeColor}`}>
                {status}
            </span>
        )
    }

    const openEditModal = (id, currentStatus) => {
        setEditId(id)
        setNewStatus(currentStatus)
        setShowModal(true)
    }

    const handleUpdateStatus = async () => {
        try {
            let payload = { status: newStatus };

            if (newStatus === "selesai") {
                const resDetail = await api.get(`/pendaftaran/${editId}`);
                const detail = resDetail.data;

                if (!detail.rekam_medis_id) {
                    return Swal.fire("Gagal", "Rekam medis tidak ditemukan", "error");
                }

                const resResep = await api.get(`/resep-obat/pendaftaran/${editId}`);
                const resep = resResep.data;
                const totalObat = resep.reduce((acc, item) => acc + (item.harga * item.jumlah), 0);

                payload = {
                    ...payload,
                    rekam_medis_id: detail.rekam_medis_id,
                    total_obat: totalObat,
                    total_biaya: (detail.biaya_dokter || 0) + totalObat
                };
            }

            // Proses Update ke Backend
            await api.put(`/pendaftaran/${editId}`, payload);

            setShowModal(false); // Tutup modal dulu

            // Alert Sukses
            await Swal.fire({
                title: "Berhasil!",
                text: newStatus === "selesai"
                    ? "Pembayaran telah dicatat. Dialihkan ke data pembayaran..."
                    : "Status berhasil diperbarui",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            // REFRESH DATA ANTRIAN
            fetchPendaftaran();

            if (newStatus === "selesai") {
                navigate("/pembayaran");
            }

            if (newStatus === "pemeriksaan") {
                navigate(`/rekam-medis/${editId}`)
            }

        } catch (error) {
            console.error(error);
            Swal.fire("Gagal", "Terjadi kesalahan saat memproses data", "error");
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus Pendaftaran?",
            text: "Data ini akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        })

        if (!confirm.isConfirmed) return

        try {
            await api.delete(`/pendaftaran/${id}`)
            Swal.fire("Berhasil", "Pendaftaran berhasil dihapus!", "success")
            fetchPendaftaran()
        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan", "error")
            console.log(err)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Data Pendaftaran</h1>
            </div>

            {loading && <p>Loading data...</p>}

            {!loading && pendaftaran.length === 0 && (
                <p className="text-gray-500">Belum ada data pendaftaran.</p>
            )}

            {!loading && pendaftaran.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow rounded-lg">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Pasien ID</th>
                                <th className="p-3 text-left">Poli ID</th>
                                <th className="p-3 text-left">Tanggal</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">No Antrian</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendaftaran.map((pen) => (
                                <tr key={pen.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{pen.id}</td>
                                    <td className="p-3">{pen.pasien_id}</td>
                                    <td className="p-3">{pen.poli_id}</td>
                                    <td className="p-3">{new Date(pen.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                    <td>
                                        <StatusBadge status={pen.status} />
                                    </td>
                                    <td className="p-3">{pen.no_antrian}</td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(pen.id, pen.status)}
                                            className="bg-yellow-300 p-3 rounded-lg text-black hover:underline"
                                        >
                                            Edit Status
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pen.id)}
                                            className="bg-red-600 p-3 rounded-lg text-white hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Edit Status */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-lg font-semibold mb-4">Edit Status</h2>

                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value="menunggu">Menunggu</option>
                            <option value="dipanggil">Dipanggil</option>
                            <option value="pemeriksaan">Pemeriksaan</option>
                            <option value="menunggu pembayaran">Menunggu Pembayaran</option>
                            <option value="selesai">Selesai</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 bg-gray-300 rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdateStatus}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}