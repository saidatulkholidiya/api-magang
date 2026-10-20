import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { Sama } from "./decorators/sama";

function trimDanLowercase({ value }: { value: unknown }): unknown {
    if (typeof value === "string") {
        return value.trim().toLowerCase();
    }
    return value;
}

function trimSaja({ value }: { value: unknown }): unknown {
    if (typeof value === "string") {
        return value.trim();
    }
    return value;
}

export class RegisterDto {
    @IsString({ message: "Nama harus berupa teks" })
    @MinLength(3, { message: "Nama minimal 3 karakter" })
    @MaxLength(100, { message: "Nama maksimal 100 karakter" })
    @Transform(trimSaja)
    nama!: string;

    @IsString({ message: "Sekolah harus berupa teks" })
    @MinLength(3, { message: "Sekolah minimal 3 karakter" })
    @MaxLength(100, { message: "Sekolah maksimal 100 karakter" })
    @Transform(trimSaja)
    sekolah!: string;

    @IsEmail({}, { message: "Format email tidak valid" })
    @Transform(trimDanLowercase)
    email!: string;

    @IsString({ message: "Password harus berupa teks" })
    @MinLength(8, { message: "Password minimal 8 karakter" })
    @MaxLength(72, { message: "Password maksimal 72 karakter" })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: "Password harus mengandung huruf dan angka",
    })
    password!: string;

    @IsString({ message: "Konfirmasi password harus berupa teks" })
    @Sama("password", { message: "Konfirmasi password tidak cocok" })
    konfirmasiPassword!: string;
}

export class LoginDto {
    @IsEmail({}, { message: "Format email tidak valid" })
    @Transform(trimDanLowercase)
    email!: string;

    @IsString({ message: "Password harus berupa teks" })
    @IsNotEmpty({ message: "Password wajib diisi" })
    password!: string;
}