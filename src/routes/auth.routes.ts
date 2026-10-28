import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validasi } from "../middlewares/validasi.middleware";
import { loginLimiter } from "../middlewares/rateLimit.middleware";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Daftarkan akun peserta baru
 *     description: |
 *       Membuat akun dengan role `peserta`.
 *       Email dinormalkan (spasi tepi dibuang, huruf kecil).
 *       Properti asing ditolak (422).
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             valid:
 *               summary: Payload valid
 *               value:
 *                 nama: Budi Santoso
 *                 sekolah: SMK 5 Malang
 *                 email: budi@mail.com
 *                 password: rahasia123
 *                 konfirmasiPassword: rahasia123
 *     responses:
 *       '201':
 *         description: Akun berhasil dibuat
 *         headers:
 *           X-Request-Id:
 *             $ref: '#/components/headers/XRequestId'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PesertaResponse'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post("/register", validasi(RegisterDto), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login dan dapatkan access token serta refresh token
 *     description: |
 *       Pesan error SAMA untuk email yang tidak terdaftar maupun password yang salah.
 *       Dibatasi 10 percobaan per 15 menit per IP.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             peserta:
 *               summary: Login peserta
 *               value:
 *                 email: budi@mail.com
 *                 password: rahasia123
 *     responses:
 *       '200':
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '401':
 *         description: Email atau password salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 *       '429':
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post("/login", loginLimiter, validasi(LoginDto), authController.login);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Perbarui access token menggunakan refresh token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       '200':
 *         description: Access token berhasil diperbarui
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '422':
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/refresh", authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Hapus refresh token (logout)
 *     security: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       '200':
 *         description: Logout berhasil
 */
router.post("/logout", authController.logout);

export default router;