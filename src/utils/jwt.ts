import jwt from "jsonwebtoken";
import { config } from "../config/env.config";

export interface JwtPayload {
    id: number;
    email: string;
    role: "peserta" | "mentor";
}

// Access Token — umur pendek (15 menit)
export function buatAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: "15m",
    } as jwt.SignOptions);
}

export function verifikasiAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
}

// Refresh Token — umur panjang (7 hari)
export function buatRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: "7d",
    } as jwt.SignOptions);
}

export function verifikasiRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
}