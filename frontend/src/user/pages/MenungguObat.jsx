import React from "react";
import { useParams } from "react-router-dom";

export default function MenungguObat() {
    const { id } = useParams();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
            <div className="bg-white shadow-lg p-8 rounded-xl max-w-lg text-center">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">
                    Obat Sedang Diproses 💊
                </h2>

                <p className="text-gray-700 mb-4">
                    Silakan menunggu, obat Anda sedang disiapkan oleh petugas farmasi.
                </p>

                <p className="text-gray-500 text-sm">
                    ID Pendaftaran: {id}
                </p>
            </div>
        </div>
    );
}
