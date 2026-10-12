import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ErrorCode } from "../utils/errorCodes";

// Rate limiter untuk login (pake library express-rate-limit)
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new AppError("Terlalu banyak percobaan, coba lagi nanti", 429, ErrorCode.RATE_LIMITED));
    },
});

// Rate limiter global (pake Map, dari Minggu 10)
const hitungan: Map<string, { count: number; resetAt: number }> = new Map();
const LIMIT = 10;
const WINDOW = 60 * 1000;

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || "unknown";
    const sekarang = Date.now();

    const data = hitungan.get(ip);

    if (!data || sekarang > data.resetAt) {
        hitungan.set(ip, { count: 1, resetAt: sekarang + WINDOW });
        next();
        return;
    }

    if (data.count >= LIMIT) {
        res.status(429).json({
            sukses: false,
            error: {
                kode: "RATE_LIMITED",
                pesan: "Terlalu banyak request. Coba lagi nanti.",
            },
            requestId: req.requestId,
        });
        return;
    }

    data.count++;
    next();
}