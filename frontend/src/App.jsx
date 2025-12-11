import { Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"

//pasien
import HomeUser from "./user/pages/HomeUser";
import DaftarUser from "./user/pages/DaftarUser";
import AntrianUser from "./user/pages/AntrianUser";

//admin
import Dashboard from "./pages/Dashboard"
import PasienList from "./pages/PasienList"
import DokterList from "./pages/DokterList"
import PoliList from "./pages/PoliList"
import PasienForm from "./pages/PasienForm"
import PendaftaranList from "./pages/PendaftaranList";

export default function App() {
  return (
    <Routes>
      {/* pasien */}
      <Route path="/welcome" element={<HomeUser />} />
      <Route path="/daftar" element={<DaftarUser />} />
      <Route path="/antrian/:id" element={<AntrianUser />} />

      {/* admin */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/dokter" element={<DokterList />} />
              <Route path="/pendaftaran" element={<PendaftaranList />} />
              <Route path="/pasien" element={<PasienList />} />
              <Route path="/pasien/tambah" element={<PasienForm />} />
              <Route path="/pasien/edit/:id" element={<PasienForm />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  )
}
