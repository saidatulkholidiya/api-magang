import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasi } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UpdateProfilDto } from "../dto/peserta.dto";
import { RegisterDto } from "../dto/auth.dto";

const router = Router();

// STATIS
router.get("/", pesertaController.getSemuaPeserta);
router.post("/", validasi(RegisterDto), pesertaController.buatPeserta);

// DINAMIS
router.get("/:id", pesertaController.getPesertaById);
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);
router.patch("/:id", authGuard, validasi(UpdateProfilDto), pesertaController.patchPeserta);
router.delete("/:id", authGuard, requireRole("mentor"), pesertaController.hapusPeserta);

export default router;