import { Router } from "express";
import { authGuard } from "../middlewares/auth.middleware";
import { validasi } from "../middlewares/validasi.middleware";
import { UpdateProfilDto } from "../dto/peserta.dto";
import * as pesertaController from "../controllers/peserta.controller";
import * as jurnalController from "../controllers/jurnal.controller";

const router = Router();

// Semua route di sini butuh login
router.use(authGuard);

// GET /api/me — profil milik sendiri
router.get("/", pesertaController.getProfilSaya);

// GET /api/me/jurnal — jurnal milik sendiri
router.get("/jurnal", jurnalController.getJurnalSaya);

router.patch("/", authGuard, validasi(UpdateProfilDto), pesertaController.patchMe);

export default router;