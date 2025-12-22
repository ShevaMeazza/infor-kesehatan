import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function DaftarUser() {
    const nav = useNavigate();

    const [poli, setPoli] = useState([]);
    const [form, setForm] = useState({
        nama: "",
        nik: "",
        tanggal_lahir: "",
        alamat: "",
        no_hp: "",
        poli_id: "",
    });


    useEffect(() => {
        api.get("/poli").then((res) => setPoli(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("DATA PASIEN DIKIRIM:", {
                nama: form.nama,
                nik: form.nik,
                tanggal_lahir: form.tanggal_lahir,
                alamat: form.alamat,
                no_hp: form.no_hp
            });
            
            const resPasien = await api.post("/pasien", {
                nama: form.nama,
                nik: form.nik,
                tanggal_lahir: form.tanggal_lahir,
                alamat: form.alamat,
                no_hp: form.no_hp
            });


            const pasienId = resPasien.data.insertId;
            console.log("DATA PENDAFTARAN DIKIRIM:", {
                pasien_id: pasienId,
                poli_id: form.poli_id
            });

            // tambah pendaftaran
            const resDaftar = await api.post("/pendaftaran", {
                pasien_id: pasienId,
                poli_id: form.poli_id
                // tanggal TIDAK perlu dikirim, backend sudah create sendiri
            });

            const pendaftaranId = resDaftar.data.insertId;
            console.log(resPasien.data)

            // redirect ke halaman antrian
            nav(`/antrian/${pendaftaranId}`);

        } catch (err) {
            console.error("ERROR SAAT MENDAFTAR:", err);
            alert("Terjadi kesalahan saat mendaftar.");
        }
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-lg"
            >
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Form Pendaftaran</h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        name="nama"
                        required
                        placeholder="Nama Lengkap"
                        className="w-full border p-2.5 rounded focus:outline-none focus:border-blue-600"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="nik"
                        required
                        placeholder="NIK"
                        className="w-full border p-2.5 rounded focus:outline-none focus:border-blue-600"
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="tanggal_lahir"
                        required
                        className="w-full border p-2.5 rounded focus:outline-none focus:border-blue-600"
                        onChange={handleChange}
                    />

                    <textarea
                        name="alamat"
                        required
                        placeholder="Alamat lengkap"
                        className="w-full border p-2.5 rounded focus:outline-none focus:border-blue-600 resize-none"
                        rows="3"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="no_hp"
                        placeholder="Nomor HP"
                        className="w-full border p-2.5 rounded focus:outline-none focus:border-blue-600"
                        onChange={handleChange}
                    />

                    <select
                        name="poli_id"
                        required
                        className="w-full border p-2.5 rounded focus:outline-none focus:border-blue-600"
                        onChange={handleChange}
                    >
                        <option value="">-- Pilih Poli --</option>
                        {poli.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nama_poli}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="w-full bg-blue-600 text-white p-2.5 rounded hover:bg-blue-700 mt-4 font-medium transition">
                    Daftar
                </button>
            </form>
        </div>
    );
}