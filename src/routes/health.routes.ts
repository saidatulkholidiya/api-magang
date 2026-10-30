import { Router } from "express";
import { AppDataSource } from "../config/database.config";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Sistem]
 *     summary: Cek apakah server hidup (liveness)
 *     security: []
 *     servers:
 *       - url: /api/v1
 *     responses:
 *       '200':
 *         description: Server hidup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 uptime: { type: number, example: 1234.56 }
 */
router.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

/**
 * @openapi
 * /health/ready:
 *   get:
 *     tags: [Sistem]
 *     summary: Cek kesiapan server dan koneksi database (readiness)
 *     security: []
 *     servers:
 *       - url: /api/v1
 *     responses:
 *       '200':
 *         description: Server siap dan database terhubung
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ready }
 *                 database: { type: string, example: up }
 *       '503':
 *         description: Server belum siap atau database terputus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: not_ready }
 *                 database: { type: string, example: down }
 */
router.get("/health/ready", async (_req, res) => {
    try {
        await AppDataSource.query("SELECT 1");
        res.json({ status: "ready", database: "up" });
    } catch {
        res.status(503).json({ status: "not_ready", database: "down" });
    }
});

export default router;