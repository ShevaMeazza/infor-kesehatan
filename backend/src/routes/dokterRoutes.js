import express from "express"
import { 
    listDokter,
    detailDokter,
    createDokter,
    editDokter,
    removeDokter
} from "../controllers/dokterController.js";

const router = express.Router()

router.get("/", listDokter)
router.get("/:id", detailDokter)
router.post("/", createDokter)
router.put("/:id", editDokter)
router.delete("/:id", removeDokter)

export default router