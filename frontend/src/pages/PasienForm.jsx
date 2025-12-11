import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import Swal from "sweetalert2"

export default function PasienForm() {
    const { id } = useParams()
    const isEdit = Boolean(id)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nama: "",
        nik: "",
        tanggal_lahir: "",
        alamat: "",        
        no_hp: "",
    })
    
    useEffect(() => {
        if (!isEdit) return

        const fetchPasien = async () => {
            const res = await api.get(`/pasien/${id}`)
            setForm(res.data)
        }

        fetchPasien()
    }, [id, isEdit])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isEdit) {
                await api.put(`/pasien/${id}`, form)
                Swal.fire("Berhasil", "Pasien berhasil diperbarui!", "success")
            } else {
                await api.post("/pasien", form)
                Swal.fire("Berhasil", "Pasien berhasil ditambahkan!", "success")
            }

            navigate("/pasien")
        } catch (err) {
            Swal.fire("Error", "Terjadi kesalahan", "error")
            console.log(err)
        }
    }

    return (
        <div className="max-w-xl bg-white shadow p-6 rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">
                {isEdit ? "Edit Pasien" : "Tambah Pasien"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="nama"
                    placeholder="Nama Lengkap"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="text"
                    name="nik"
                    placeholder="NIK"
                    value={form.nik}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="date"
                    name="tanggal_lahir"
                    value={form.tanggal_lahir}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />

                <input
                    type="text"
                    name="alamat"
                    placeholder="Alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />                

                <input
                    type="text"
                    name="no_hp"
                    placeholder="No Handphone"
                    value={form.no_hp}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {isEdit ? "Update" : "Simpan"}
                </button>
            </form>
        </div>
    )
}
