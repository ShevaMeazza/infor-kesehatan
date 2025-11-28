import express from "express";
import { 
    listObat, 
    addObat, 
    editObat, 
    removeObat 
} from "../controllers/obatController.js";

const router = express.Router();

router.get("/", listObat);
router.post("/", addObat);
router.put("/:id", editObat);
router.delete("/:id", removeObat);

export default router;
