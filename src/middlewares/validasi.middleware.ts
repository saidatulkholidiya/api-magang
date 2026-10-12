import { Request, Response, NextFunction } from "express";
import { ValidationError, FieldError } from "../utils/AppError";

export function validasiPeserta(req: Request, res: Response, next: NextFunction): void {
    const { nama, sekolah } = req.body;
    const errors: FieldError[] = [];

    if (!nama || typeof nama !== "string" || nama.trim().length < 3) {
        errors.push({ field: "nama", pesan: "Nama wajib diisi, minimal 3 karakter" });
    }
    if (!sekolah || typeof sekolah !== "string") {
        errors.push({ field: "sekolah", pesan: "Sekolah wajib diisi" });
    }

    if (errors.length > 0) {
        next(new ValidationError(errors));
        return;
    }

    next();
}

export function validasiJurnal(req: Request, res: Response, next: NextFunction): void {
    const { pesertaId, kegiatan } = req.body;
    const errors: FieldError[] = [];

    if (!pesertaId || typeof pesertaId !== "number") {
        errors.push({ field: "pesertaId", pesan: "PesertaId wajib diisi dan berupa angka" });
    }
    if (!kegiatan || typeof kegiatan !== "string" || kegiatan.trim().length < 10) {
        errors.push({ field: "kegiatan", pesan: "Kegiatan wajib diisi, minimal 10 karakter" });
    }

    if (errors.length > 0) {
        next(new ValidationError(errors));
        return;
    }

    next();
}

export function validasiRegister(req: Request, res: Response, next: NextFunction): void {
    const { nama, sekolah, email, password } = req.body;
    const errors: FieldError[] = [];

    if (!nama || typeof nama !== "string" || nama.trim().length < 3) {
        errors.push({ field: "nama", pesan: "Nama wajib diisi, minimal 3 karakter" });
    }
    if (!sekolah || typeof sekolah !== "string") {
        errors.push({ field: "sekolah", pesan: "Sekolah wajib diisi" });
    }
    if (!email || typeof email !== "string") {
        errors.push({ field: "email", pesan: "Email wajib diisi" });
    } else {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            errors.push({ field: "email", pesan: "Format email tidak valid" });
        }
    }
    if (!password || typeof password !== "string" || password.length < 8) {
        errors.push({ field: "password", pesan: "Password minimal 8 karakter" });
    }

    if (errors.length > 0) {
        next(new ValidationError(errors));
        return;
    }

    next();
}

export function validasiLogin(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;
    const errors: FieldError[] = [];

    if (!email || typeof email !== "string") {
        errors.push({ field: "email", pesan: "Email wajib diisi" });
    }
    if (!password || typeof password !== "string") {
        errors.push({ field: "password", pesan: "Password wajib diisi" });
    }

    if (errors.length > 0) {
        next(new ValidationError(errors));
        return;
    }

    next();
}