import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";
import { dibuat, sukses } from "../utils/response";
import { ValidationError } from "../utils/AppError";
import { ambilDto } from "../middlewares/validasi.middleware";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const data = ambilDto<RegisterDto>(req);
    const hasil = await authService.register(data);
    dibuat(res, hasil, "Registrasi berhasil");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const data = ambilDto<LoginDto>(req);
    const hasil = await authService.login(data);
    sukses(res, hasil, "Login berhasil");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ValidationError([
            { field: "refreshToken", pesan: "Refresh token wajib diisi" },
        ]);
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