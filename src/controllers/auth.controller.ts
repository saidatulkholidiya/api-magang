import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";
import { dibuat, sukses } from "../utils/response";

export const register = asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    dibuat(res, data, "Registrasi berhasil");
});

export const login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    sukses(res, data, "Login berhasil");
});