import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasiPeserta } from "../middlewares/validasi.middleware";
import { cekApiKey } from "../middlewares/auth.middleware";

const router = Router();

// Peserta
router.get("/", pesertaController.getSemuaPeserta);
router.get("/:id", pesertaController.getPesertaById);
router.post("/", validasiPeserta, pesertaController.buatPeserta);
router.put("/:id", validasiPeserta, pesertaController.updatePeserta);
router.delete("/:id", cekApiKey, pesertaController.hapusPeserta);

// Nested route: jurnal milik peserta
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);

export default router;