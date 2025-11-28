import {
    listRekamMedis,
    addRekamMedis
} from "../controllers/rekamMedisController.js"
import express from "express"
const router = express.Router()

router.get("/", listRekamMedis)
router.post("/", addRekamMedis)

export default router