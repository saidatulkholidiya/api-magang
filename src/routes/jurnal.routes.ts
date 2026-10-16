import { Router } from "express";
import * as jurnalController from "../controllers/jurnal.controller";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validasi } from "../middlewares/validasi.middleware";
import { BuatJurnalDto } from "../dto/jurnal.dto";
import { IdParamDto } from "../dto/common.dto";

const router = Router();

router.get("/saya", authGuard, jurnalController.getJurnalSaya);
router.post("/", authGuard, validasi(BuatJurnalDto), jurnalController.buatJurnal);

router.get("/:id", authGuard, validasi(IdParamDto, "params"), jurnalController.getJurnalById);
router.patch("/:id", authGuard, validasi(IdParamDto, "params"), validasi(BuatJurnalDto), jurnalController.updateJurnal);
router.delete("/:id", authGuard, validasi(IdParamDto, "params"), jurnalController.hapusJurnal);

router.get("/", authGuard, requireRole("mentor"), jurnalController.getSemuaJurnal);
router.patch("/:id/review", authGuard, requireRole("mentor"), validasi(IdParamDto, "params"), jurnalController.reviewJurnal);

export default router;