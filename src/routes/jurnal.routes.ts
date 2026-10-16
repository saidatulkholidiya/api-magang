import { Router } from "express";
import * as jurnalController from "../controllers/jurnal.controller";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validasi } from "../middlewares/validasi.middleware";
import { BuatJurnalDto } from "../dto/jurnal.dto";

const router = Router();

// Route yang butuh login
router.get("/saya", authGuard, jurnalController.getJurnalSaya);
router.post("/", authGuard, validasi(BuatJurnalDto), jurnalController.buatJurnal);
router.get("/:id", authGuard, jurnalController.getJurnalById);
router.patch("/:id", authGuard, validasi(BuatJurnalDto), jurnalController.updateJurnal);
router.delete("/:id", authGuard, jurnalController.hapusJurnal);

// HANYA mentor
router.get("/", authGuard, requireRole("mentor"), jurnalController.getSemuaJurnal);
router.patch("/:id/review", authGuard, requireRole("mentor"), jurnalController.reviewJurnal);

export default router;