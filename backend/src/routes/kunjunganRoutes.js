import express from "express";
import { createKunjungan, listKunjungan } from "../controllers/kunjunganController.js";

const router = express.Router();

router.post("/kunjungan", createKunjungan);
router.get("/kunjungan", listKunjungan);

export default router;
