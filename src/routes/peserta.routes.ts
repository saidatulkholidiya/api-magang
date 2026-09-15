import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";

const router = Router();

// Peserta
router.get("/", pesertaController.getSemuaPeserta);
router.get("/:id", pesertaController.getPesertaById);
router.post("/", pesertaController.buatPeserta);
router.put("/:id", pesertaController.updatePeserta);
router.delete("/:id", pesertaController.hapusPeserta);

// Nested route: jurnal milik peserta
router.get("/:id/jurnal", pesertaController.getJurnalPeserta);

export default router;