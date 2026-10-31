import { Router } from "express";
import * as statsController from "../controllers/stats.controller";

const router = Router();

/**
 * @openapi
 * /stats:
 *   get:
 *     tags: [Sistem]
 *     summary: Ambil data statistik
 *     security: []
 *     responses:
 *       '200':
 *         description: Data statistik berhasil diambil
 */
router.get("/", statsController.getStats);

export default router;