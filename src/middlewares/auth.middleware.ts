import { Request, Response, NextFunction } from "express";
import { verifikasiAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/AppError";

export function authGuard(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Token tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new UnauthorizedError("Token tidak valid");
    }

    try {
        const payload = verifikasiAccessToken(token);
        req.user = payload;
        next();
    } catch (err) {
        throw new UnauthorizedError("Token tidak valid atau sudah kedaluwarsa");
    }
}