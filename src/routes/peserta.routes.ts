import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasiPeserta } from "../middlewares/validasi.middleware";
import { cekApiKey } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", pesertaController.getSemuaPeserta);
router.get("/:id", pesertaController.getPesertaById);
router.post("/", validasiPeserta, pesertaController.buatPeserta);
router.put("/:id", validasiPeserta, pesertaController.updatePeserta);
router.delete("/:id", cekApiKey, pesertaController.hapusPeserta);
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);

export default router;