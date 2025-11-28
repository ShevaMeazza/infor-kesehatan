import express from "express";
import {
    listPasien,
    detailPasien,
    createPasien,
    editPasien,
    removePasien,
} from "../controllers/pasienController.js";

const router = express.Router();

router.get("/", listPasien);
router.get("/:id", detailPasien);
router.post("/", createPasien);
router.put("/:id", editPasien);
router.delete("/:id", removePasien);

export default router;
