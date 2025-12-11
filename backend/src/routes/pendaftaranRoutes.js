import express from "express";
import {
    daftar,
    listPendaftaran,
    getPendaftaran,
    editStatusPendaftaran
} from "../controllers/pendaftaranController.js";

const router = express.Router();

router.get("/", listPendaftaran);
router.post("/", daftar);
router.get("/:id", getPendaftaran);    
router.put("/:id", editStatusPendaftaran);

export default router;
