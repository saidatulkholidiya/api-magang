import { Router } from "express";
import * as jurnalController from "../controllers/jurnal.controller";
import { validasiJurnal } from "../middlewares/validasi.middleware";
import { cekApiKey } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", jurnalController.getSemuaJurnal);
router.get("/:id", jurnalController.getJurnalById);
router.post("/", validasiJurnal, jurnalController.buatJurnal);
router.put("/:id", validasiJurnal, jurnalController.updateJurnal);
router.patch("/:id/review", jurnalController.reviewJurnal);
router.delete("/:id", cekApiKey, jurnalController.hapusJurnal);

export default router;