import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const menu = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Pasien", path: "/pasien" },
        { name: "Dokter", path: "/dokter" },
        { name: "Poli", path: "/poli" },
        { name: "Obat", path: "/obat" },
        { name: "Pendaftaran", path: "/pendaftaran" },
        { name: "Rekam Medis", path: "/rekam-medis" },
        { name: "Pembayaran", path: "/pembayaran" },
    ];

    const { pathname } = useLocation();

    return (
        <aside className="w-60 h-screen bg-white shadow-md p-4 fixed left-0 top-0">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">Klinik</h1>

            <nav className="flex flex-col gap-2">
                {menu.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`p-2 rounded-lg hover:bg-blue-100 ${pathname === item.path ? "bg-blue-500 text-white" : "text-gray-700"
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
