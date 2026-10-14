import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasiPeserta } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

// STATIS
router.get("/", pesertaController.getSemuaPeserta);
router.post("/", validasiPeserta, pesertaController.buatPeserta);

// DINAMIS
router.get("/:id", pesertaController.getPesertaById);
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);
router.patch("/:id", authGuard, pesertaController.patchPeserta); 
router.delete("/:id", authGuard, requireRole("mentor"), pesertaController.hapusPeserta);

export default router;