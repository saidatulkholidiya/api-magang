import { Router } from "express";
import { authGuard } from "../middlewares/auth.middleware";
import { validasi } from "../middlewares/validasi.middleware";
import { UpdateProfilDto } from "../dto/peserta.dto";
import * as pesertaController from "../controllers/peserta.controller";
import * as jurnalController from "../controllers/jurnal.controller";

const router = Router();

// Semua route di sini butuh login
router.use(authGuard);

/**
 * @openapi
 * /me:
 *   get:
 *     tags: [Profil]
 *     summary: Ambil data profil sendiri
 *     responses:
 *       '200':
 *         description: Data profil berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PesertaResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */

// GET /api/me — profil milik sendiri
router.get("/", pesertaController.getProfilSaya);

// GET /api/me/jurnal — jurnal milik sendiri
router.get("/jurnal", jurnalController.getJurnalSaya);

/**
 * @openapi
 * /me:
 *   patch:
 *     tags: [Profil]
 *     summary: Ubah profil sendiri
 *     description: |
 *       Hanya `nama`, `sekolah`, dan `telepon` yang boleh diubah.
 *       Properti lain (termasuk role, email, password) ditolak dengan 422.
 *       Minimal satu field harus diisi.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilRequest'
 *           examples:
 *             ubahNama:
 *               summary: Ubah nama saja
 *               value:
 *                 nama: Budi Santoso Putra
 *     responses:
 *       '200':
 *         description: Profil berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PesertaResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */

router.patch("/", authGuard, validasi(UpdateProfilDto), pesertaController.patchMe);

export default router;