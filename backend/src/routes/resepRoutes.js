import express from "express"
import { 
    addResep, 
    listResepByRekam, 
    removeResep 
} from "../controllers/resepController.js"

const router = express.Router()

router.post("/", addResep)
router.get("/:rekam_medis_id", listResepByRekam)
router.delete("/:id", removeResep)

export default router
