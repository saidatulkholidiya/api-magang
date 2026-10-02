import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasiPeserta } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/profil-saya", authGuard, pesertaController.getProfilSaya);

// Route publik
router.get("/", pesertaController.getSemuaPeserta);
router.get("/:id", pesertaController.getPesertaById);
router.post("/", validasiPeserta, pesertaController.buatPeserta);

// Route yang butuh login
router.put("/:id", authGuard, validasiPeserta, pesertaController.updatePeserta);

// HANYA mentor yang boleh hapus peserta
router.delete(
    "/:id",
    authGuard,
    requireRole("mentor"),
    pesertaController.hapusPeserta
);

// Nested route
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);

export default router;