import { Router } from "express";
import * as jurnalController from "../controllers/jurnal.controller";
import { validasiJurnal } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

// Route yang butuh login
router.get("/", authGuard, jurnalController.getSemuaJurnal);
router.get("/saya", authGuard, jurnalController.getJurnalSaya);
router.post("/", authGuard, validasiJurnal, jurnalController.buatJurnal);

// Route :id
router.get("/:id", authGuard, jurnalController.getJurnalById);
router.put("/:id", authGuard, validasiJurnal, jurnalController.updateJurnal);
router.patch("/:id/review", authGuard, jurnalController.reviewJurnal);
router.delete("/:id", authGuard, jurnalController.hapusJurnal);

export default router;