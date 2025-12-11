import { Link } from "react-router-dom";

export default function HomeUser() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">
                Selamat Datang di Klinik
            </h1>

            <p className="text-gray-700 mb-6">
                Silakan lakukan pendaftaran untuk mendapatkan nomor antrian.
            </p>

            <Link
                to="/daftar"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
                Daftar Sekarang
            </Link>
        </div>
    );
}
