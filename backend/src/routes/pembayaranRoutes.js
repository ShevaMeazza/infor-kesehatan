import express from "express"
import { 
    prosesPembayaran, 
    listPembayaran 
} from "../controllers/pembayaranController.js"

const router = express.Router()

router.post("/", prosesPembayaran)
router.get("/", listPembayaran)

export default router