import express from "express"
import { 
    daftar,
    listPendaftaran,
    editStatusPendaftaran
} from "../controllers/pendaftaranController.js";

const router = express.Router()

router.post("/", daftar)
router.get("/", listPendaftaran)
router.put("/:id", editStatusPendaftaran)

export default router