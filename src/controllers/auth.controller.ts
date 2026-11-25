
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";
import { dibuat, sukses } from "../utils/response";
import { ValidationError, UnauthorizedError } from "../utils/AppError";
import { ambilDto } from "../middlewares/validasi.middleware";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import {
  NAMA_COOKIE_REFRESH,
  hapusCookieRefresh,
  setCookieRefresh,
} from "../utils/cookie";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = ambilDto<RegisterDto>(req);
  const hasil = await authService.register(data);
  dibuat(res, hasil, "Registrasi berhasil");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, peserta } =
    await authService.login(ambilDto<LoginDto>(req));

  setCookieRefresh(res, refreshToken);

  sukses(res, { accessToken, peserta }, "Login berhasil");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token: unknown = req.cookies?.[NAMA_COOKIE_REFRESH];

  if (typeof token !== "string" || token === "") {
    throw new UnauthorizedError("Sesi tidak ditemukan, silakan login");
  }

  const hasil = await authService.refresh(token);
  sukses(res, hasil, "Token diperbarui");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token: unknown = req.cookies?.[NAMA_COOKIE_REFRESH];

  if (typeof token === "string" && token !== "") {
    await authService.logout(token);
  }

  hapusCookieRefresh(res);
  res.status(204).send();
});
