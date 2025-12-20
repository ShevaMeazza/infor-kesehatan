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
import MenungguObat from "./user/pages/MenungguObat";
import RekamMedisList from "./pages/RekamMedisList";
import RekamMedisForm from "./pages/RekamMedisForm";
import ObatList from "./pages/ObatList";

export default function App() {
  return (
    <Routes>
      {/* pasien */}
      <Route path="/welcome" element={<HomeUser />} />
      <Route path="/daftar" element={<DaftarUser />} />
      <Route path="/antrian/:id" element={<AntrianUser />} />
      <Route path="/menunggu-obat/:id" element={<MenungguObat />} />

      {/* admin */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/dokter" element={<DokterList />} />
              <Route path="/pendaftaran" element={<PendaftaranList />} />
              <Route path="/poli" element={<PoliList />} />
              <Route path="/pasien" element={<PasienList />} />
              <Route path="/pasien/tambah" element={<PasienForm />} />
              <Route path="/pasien/edit/:id" element={<PasienForm />} />
              <Route path="/obat" element={<ObatList />} />
              <Route path="/rekam-medis" element={<RekamMedisList />} />
              <Route path="/rekam-medis/:id" element={<RekamMedisForm />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  )
}
