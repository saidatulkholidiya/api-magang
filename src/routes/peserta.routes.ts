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

/**
 * @openapi
 * /peserta:
 *   get:
 *     tags: [Peserta]
 *     summary: Daftar peserta (khusus mentor)
 *     description: |
 *       Mendukung pagination, filter, pengurutan, dan pencarian pada nama atau email.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Order'
 *       - $ref: '#/components/parameters/Q'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nama, fase, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sekolah
 *         schema: { type: string, maxLength: 100 }
 *       - in: query
 *         name: fase
 *         schema: { type: integer, minimum: 1, maximum: 5 }
 *     responses:
 *       '200':
 *         description: Daftar peserta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PesertaListResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */
router.get("/", authGuard, requireRole("mentor"), validasi(ListPesertaQueryDto, "query"), pesertaController.getSemuaPeserta);
router.get("/", validasi(ListPesertaQueryDto, "query"), pesertaController.getSemuaPeserta);
router.post("/", validasi(RegisterDto), pesertaController.buatPeserta);

// DINAMIS

/**
 * @openapi
 * /peserta/{id}:
 *   get:
 *     tags: [Peserta]
 *     summary: Ambil detail peserta berdasarkan ID
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Data peserta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PesertaResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", validasi(IdParamDto, "params"), pesertaController.getPesertaById);

/**
 * @openapi
 * /peserta/{id}/jurnal:
 *   get:
 *     tags: [Peserta]
 *     summary: Ambil daftar jurnal milik peserta tertentu
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Daftar jurnal peserta
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id/jurnal", validasi(IdParamDto, "params"), pesertaController.getJurnalPeserta);

/**
 * @openapi
 * /peserta/{id}:
 *   patch:
 *     tags: [Peserta]
 *     summary: Ubah data peserta (khusus mentor atau pemilik akun)
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilRequest'
 *     responses:
 *       '200':
 *         description: Data berhasil diubah
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */
router.patch("/:id", authGuard, validasi(IdParamDto, "params"), validasi(UpdateProfilDto), pesertaController.patchPeserta);

/**
 * @openapi
 * /peserta/{id}:
 *   delete:
 *     tags: [Peserta]
 *     summary: Hapus peserta (khusus mentor)
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '204':
 *         description: Berhasil dihapus (tanpa body)
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", authGuard, requireRole("mentor"), validasi(IdParamDto, "params"), pesertaController.hapusPeserta);

export default router;