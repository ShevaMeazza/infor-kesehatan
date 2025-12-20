import express from "express";
import {
    daftar,
    listPendaftaran,
    getPendaftaran,
    editStatusPendaftaran,
    removePendaftaran
} from "../controllers/pendaftaranController.js";

const router = express.Router();

router.get("/", listPendaftaran);
router.post("/", daftar);
router.get("/:id", getPendaftaran);    
router.put("/:id", editStatusPendaftaran);
router.delete("/:id", removePendaftaran);

export default router;
