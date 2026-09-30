import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasiPeserta } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

// Route khusus (harus di atas route :id)
router.get("/profil-saya", authGuard, pesertaController.getProfilSaya);

// Route publik
router.get("/", pesertaController.getSemuaPeserta);
router.post("/", validasiPeserta, pesertaController.buatPeserta);

// Route :id
router.get("/:id", pesertaController.getPesertaById);
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);
router.put("/:id", authGuard, validasiPeserta, pesertaController.updatePeserta);
router.delete("/:id", authGuard, pesertaController.hapusPeserta);

export default router;