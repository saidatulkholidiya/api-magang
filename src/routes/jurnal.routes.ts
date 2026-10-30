import { Router } from "express";
import * as jurnalController from "../controllers/jurnal.controller";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validasi } from "../middlewares/validasi.middleware";
import { CreateJurnalDto, UpdateJurnalDto, ReviewJurnalDto, ListJurnalQueryDto } from "../dto/jurnal.dto";
import { IdParamDto } from "../dto/common.dto";

const router = Router();

/**
 * @openapi
 * /me/jurnal:
 *   get:
 *     tags: [Profil]
 *     summary: Ambil daftar jurnal milik sendiri
 *     responses:
 *       '200':
 *         description: Daftar jurnal milik sendiri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JurnalListResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/jurnal", jurnalController.getJurnalSaya);
/**
 * @openapi
 * /jurnal:
 *   post:
 *     tags: [Jurnal]
 *     summary: Buat jurnal harian baru
 *     description: |
 *       Jurnal otomatis dimiliki pengguna yang login. `pesertaId` tidak boleh dikirim lewat body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJurnalRequest'
 *           examples:
 *             sederhana:
 *               summary: Tanpa lampiran
 *               value:
 *                 kegiatan: Belajar unit testing dengan Jest dan Supertest
 *             denganLampiran:
 *               summary: Dengan lampiran tangkapan layar
 *               value:
 *                 kegiatan: Menulis test untuk DTO dan service
 *                 hambatan: Bingung cara mock repository
 *                 linkCommit: https://github.com/budi/api-magang/commit/abc123
 *                 lampiran:
 *                   - url: https://contoh.com/ss1.png
 *                     keterangan: Hasil npm test
 *     responses:
 *       '201':
 *         description: Jurnal berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JurnalResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", authGuard, validasi(CreateJurnalDto), jurnalController.buatJurnal);

router.get("/:id", authGuard, validasi(IdParamDto, "params"), jurnalController.getJurnalById);
router.patch("/:id", authGuard, validasi(IdParamDto, "params"), validasi(UpdateJurnalDto), jurnalController.updateJurnal);
router.delete("/:id", authGuard, validasi(IdParamDto, "params"), jurnalController.hapusJurnal);

/**
 * @openapi
 * /jurnal:
 *   get:
 *     tags: [Jurnal]
 *     summary: Daftar semua jurnal (khusus mentor)
 *     description: |
 *       Mengembalikan jurnal seluruh peserta dengan pagination.
 *       - Hanya role `mentor`. Peserta mendapat 403; gunakan `/me/jurnal` untuk jurnal sendiri.
 *       - `from` dan `to` memfilter berdasarkan tanggal pembuatan (format YYYY-MM-DD).
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Order'
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, statusReview], default: createdAt }
 *       - in: query
 *         name: statusReview
 *         schema: { type: string, enum: [belum, sudah] }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *     responses:
 *       '200':
 *         description: Daftar jurnal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JurnalListResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */
router.get("/", authGuard, requireRole("mentor"), validasi(ListJurnalQueryDto, "query"), jurnalController.getSemuaJurnal);
/**
 * @openapi
 * /jurnal/{id}/review:
 *   patch:
 *     tags: [Jurnal]
 *     summary: Ubah status review jurnal (khusus mentor)
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewJurnalRequest'
 *     responses:
 *       '200':
 *         description: Status review berhasil diubah
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */
router.patch("/:id/review", authGuard, requireRole("mentor"), validasi(IdParamDto, "params"), validasi(ReviewJurnalDto), jurnalController.reviewJurnal);

export default router;