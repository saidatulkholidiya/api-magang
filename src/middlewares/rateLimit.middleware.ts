import { Request, Response, NextFunction } from "express";

const hitungan: Map<string, { count: number; resetAt: number }> = new Map();
const LIMIT = 10;              // 10 request
const WINDOW = 60 * 1000;      // per 60 detik

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || "unknown";
    const sekarang = Date.now();

    const data = hitungan.get(ip);

    // Kalo belum ada atau udah lewat window, reset
    if (!data || sekarang > data.resetAt) {
        hitungan.set(ip, { count: 1, resetAt: sekarang + WINDOW });
        next();
        return;
    }

    // Kalo udah lewat limit
    if (data.count >= LIMIT) {
        res.status(429).json({
            error: "Terlalu banyak request. Coba lagi nanti.",
            resetAt: new Date(data.resetAt).toISOString()
        });
        return;
    }

    // Tambah hitungan
    data.count++;
    next();
}