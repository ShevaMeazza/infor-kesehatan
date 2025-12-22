import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
    return (
        <div>
            <Sidebar />
            <Navbar />
            <main className="pt-20 pl-64 pr-6 pb-6 min-h-screen bg-gray-50">
                {children}
            </main>
        </div>
    );
}
