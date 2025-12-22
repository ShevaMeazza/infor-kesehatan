import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function PembayaranPasien() {
    const { id } = useParams();
    const nav = useNavigate();
    const [detail, setDetail] = useState(null);
    const [resep, setResep] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false)

    const fetchDataInvoice = async () => {
        try {
            const resPendaftaran = await api.get(`/pendaftaran/${id}`);
            setDetail(resPendaftaran.data);

            const resResep = await api.get(`/resep-obat/pendaftaran/${id}`);
            setResep(resResep.data);

            if (resPendaftaran.data.status?.toLowerCase() === "selesai") {
                setIsPaid(true);
            }
        } catch (err) {
            console.error("Gagal memuat invoice:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintAndExit = () => {
        window.print()

        setTimeout(() => {
            alert("Terimakasih! Sesi anda telah berakhir.")
            nav("/welcome")
        }, 2000)
    }

    useEffect(() => {
        fetchDataInvoice();
        const interval = setInterval(fetchDataInvoice, 3000);
        return () => clearInterval(interval);
    }, [id]);

    const totalObat = resep.reduce((acc, item) => acc + (item.harga * item.jumlah), 0);
    const biayaDokter = detail?.biaya_dokter || 0;
    const totalBayar = biayaDokter + totalObat;


    if (loading) return <div className="p-10 text-center font-semibold text-green-600">Menyiapkan Rincian Biaya...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-start">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden border border-gray-200">

                {/* Header Invoice */}
                <div className="bg-green-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold uppercase tracking-widest">Billing Invoice</h1>
                        <span className="text-xs bg-green-800 px-2 py-1 rounded">ASLI</span>
                    </div>
                    <p className="text-green-100 text-sm mt-1">No. Registrasi: #{id}</p>
                </div>

                <div className="p-6">
                    {/* --- PERBAIKAN IDENTITAS PASIEN --- */}
                    <div className="flex justify-between border-b pb-4 mb-6 text-sm">
                        <div>
                            <p className="text-gray-500 italic">Pasien:</p>
                            <p className="font-bold text-gray-800 text-base">{detail?.nama_pasien}</p> {/* Ganti dari detail.nama */}
                            <p className="text-gray-500">{detail?.nama_poli}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 italic">Dokter Pemeriksa:</p>
                            <p className="font-semibold text-gray-800">{detail?.nama_dokter || "Dr. Umum"}</p>
                            <p className="text-gray-400 text-xs">
                                {/* Proteksi tanggal agar tidak Invalid Date */}
                                {detail?.tanggal ? new Date(detail.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                            </p>
                        </div>
                    </div>

                    {/* Rincian Item */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Rincian Layanan</h3>

                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-700 text-sm font-medium">Jasa Konsultasi & Tindakan</span>
                            <span className="font-bold text-gray-900 text-sm">
                                Rp {biayaDokter.toLocaleString('id-ID')}
                            </span>
                        </div>

                        {/* Resep Obat */}
                        {resep.length > 0 ? (
                            <div className="px-1">
                                <p className="text-[10px] font-bold text-green-600 mb-2 uppercase">Farmasi/Obat:</p>
                                {resep.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm mb-2 border-b border-gray-50 pb-1">
                                        <span className="text-gray-600">{item.nama_obat} <span className="text-xs text-gray-400">x{item.jumlah}</span></span>
                                        <span className="text-gray-800 font-medium">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-2 border-t border-dashed">
                                <p className="text-xs text-gray-400 italic">Tidak ada resep obat.</p>
                            </div>
                        )}
                    </div>

                    {/* Ringkasan Total */}
                    <div className="mt-8 border-t-2 border-dashed pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold uppercase text-xs">Total yang harus dibayar</span>
                            <span className="text-2xl font-black text-green-700">
                                Rp {totalBayar.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Instruksi Lanjut */}
                    <div className="mt-8">
                        {!isPaid ? (
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                                <p className="text-xs text-orange-800 font-bold uppercase">Langkah Selanjutnya:</p>
                                <p className="text-xs text-orange-700 mt-1">
                                    Silakan tunjukkan layar ini ke bagian <b>Kasir/Apotek</b> untuk pembayaran.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                                    <p className="text-xs text-green-800 font-bold uppercase">Pembayaran Berhasil!</p>
                                    <p className="text-xs text-green-700 mt-1">
                                        Terima kasih, pembayaran Anda telah diterima oleh kasir.
                                    </p>
                                </div>

                                <button
                                    onClick={handlePrintAndExit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🖨️</span> Cetak & Selesai
                                </button>

                                <button
                                    onClick={() => nav("/welcome")}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-xl transition-all text-sm"
                                >
                                    Kembali Tanpa Cetak
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-[10px] text-gray-400 text-center mt-6">
                        Terima kasih telah mempercayakan kesehatan Anda kepada kami.
                    </p>
                </div>
            </div>
        </div>
    );
}