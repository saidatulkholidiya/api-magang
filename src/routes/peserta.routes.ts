import { Router } from "express";
import * as pesertaController from "../controllers/peserta.controller";
import { validasi } from "../middlewares/validasi.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UpdateProfilDto, ListPesertaQueryDto } from "../dto/peserta.dto";
import { RegisterDto } from "../dto/auth.dto";
import { IdParamDto } from "../dto/common.dto";

const router = Router();

// STATIS — menggunakan validasi query
router.get("/", validasi(ListPesertaQueryDto, "query"), pesertaController.getSemuaPeserta);
router.post("/", validasi(RegisterDto), pesertaController.buatPeserta);

// DINAMIS
router.get("/:id", validasi(IdParamDto, "params"), pesertaController.getPesertaById);
router.get("/:id/jurnal", validasi(IdParamDto, "params"), pesertaController.getJurnalPeserta);
router.patch("/:id", authGuard, validasi(IdParamDto, "params"), validasi(UpdateProfilDto), pesertaController.patchPeserta);
router.delete("/:id", authGuard, requireRole("mentor"), validasi(IdParamDto, "params"), pesertaController.hapusPeserta);

export default router;