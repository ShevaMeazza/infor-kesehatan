import express from "express"
import {
    listPoli,
    createPoli,
    editPoli,
    removePoli
}
from "../controllers/poliController.js"

const router = express.Router()

router.get("/", listPoli)
router.post("/", createPoli)
router.put("/:id", editPoli)
router.delete("/:id", removePoli)

export default router