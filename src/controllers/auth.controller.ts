import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";
import { dibuat, sukses } from "../utils/response";
import { ValidationError } from "../utils/AppError";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.register(req.body);
    dibuat(res, data, "Registrasi berhasil");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(req.body);
    sukses(res, data, "Login berhasil");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ValidationError(["Refresh token wajib diisi"]);
    }
    const data = await authService.refresh(refreshToken);
    sukses(res, data, "Access token berhasil diperbarui");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        await authService.logout(refreshToken);
    }
    sukses(res, null, "Logout berhasil");
});