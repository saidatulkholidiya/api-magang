import { Router } from "express";
import * as jurnalController from "../controllers/jurnal.controller";
import { validasiJurnal } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// Route yang butuh login (peserta & mentor)
router.get("/saya", authGuard, jurnalController.getJurnalSaya);
router.post("/", authGuard, validasiJurnal, jurnalController.buatJurnal);
router.get("/:id", authGuard, jurnalController.getJurnalById);
router.put("/:id", authGuard, validasiJurnal, jurnalController.updateJurnal);
router.delete("/:id", authGuard, jurnalController.hapusJurnal);

// HANYA mentor yang boleh lihat SEMUA jurnal
router.get(
    "/",
    authGuard,
    requireRole("mentor"),
    jurnalController.getSemuaJurnal
);

// HANYA mentor yang boleh review
router.patch(
    "/:id/review",
    authGuard,
    requireRole("mentor"),
    jurnalController.reviewJurnal
);

export default router;