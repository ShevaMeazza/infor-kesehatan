import express from 'express'
import cors from 'cors'

import pasienRoutes from './routes/pasienRoutes.js'
import dokterRoutes from './routes/dokterRoutes.js'
import poliRoutes from './routes/poliRoutes.js'
import kunjunganRoutes from './routes/kunjunganRoutes.js'
import pendaftaranRoutes from './routes/pendaftaranRoutes.js'
import obatRoutes from './routes/obatRoutes.js'
import rekamMedisRoutes from './routes/rekamMedisRoutes.js'
import resepRoutes from './routes/resepRoutes.js'
import pembayaranRoutes from './routes/pembayaranRoutes.js'

const app = express()

app.use(cors())
app.use(express.json()) 

app.get('/', (req, res) => res.json({ msg: 'Backend klinik is running...' }))

app.use('/pasien', pasienRoutes)
app.use('/dokter', dokterRoutes)
app.use('/poli', poliRoutes)
app.use('/', kunjunganRoutes)
app.use('/pendaftaran', pendaftaranRoutes)
app.use('/obat', obatRoutes)
app.use('/rekam-medis', rekamMedisRoutes)
app.use('/resep', resepRoutes)
app.use('/resep-obat', resepRoutes)
app.use('/pembayaran',pembayaranRoutes)

app.listen(5001, () => console.log(`Server running on port 5001`))