import { AppDataSource } from "../config/database.config";
import { Peserta } from "../entities/Peserta.entity";
import { RefreshToken } from "../entities/RefreshToken.entity";
import { hashPassword, cekPassword } from "../utils/password";
import { buatAccessToken, buatRefreshToken, verifikasiRefreshToken } from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../utils/AppError";

const repo = AppDataSource.getRepository(Peserta);
const refreshRepo = AppDataSource.getRepository(RefreshToken);

interface RegisterInput {
    nama: string;
    sekolah: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export async function register(data: RegisterInput) {
    const sudahAda = await repo.findOneBy({ email: data.email });
    if (sudahAda) {
        throw new ConflictError("Email sudah terdaftar");
    }

    const passwordHash = await hashPassword(data.password);

    const peserta = repo.create({
        nama: data.nama,
        sekolah: data.sekolah,
        email: data.email,
        password: passwordHash,
        role: "peserta",
    });

    const tersimpan = await repo.save(peserta);
    const { password, ...aman } = tersimpan;

    return aman;
}

export async function login(data: LoginInput) {
    const peserta = await repo.findOneBy({ email: data.email });

    if (!peserta) {
        throw new UnauthorizedError("Email atau password salah");
    }

    const passwordCocok = await cekPassword(data.password, peserta.password);
    if (!passwordCocok) {
        throw new UnauthorizedError("Email atau password salah");
    }

    const payload = {
        id: peserta.id,
        email: peserta.email,
        role: peserta.role,
    };

    const accessToken = buatAccessToken(payload);
    const refreshToken = buatRefreshToken(payload);

    // Simpan refresh token di database
    await refreshRepo.save({
        token: refreshToken,
        pesertaId: peserta.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { password, ...pesertaAman } = peserta;

    return { accessToken, refreshToken, peserta: pesertaAman };
}

export async function refresh(refreshTokenInput: string) {
    const payload = verifikasiRefreshToken(refreshTokenInput);

    const tersimpan = await refreshRepo.findOneBy({ token: refreshTokenInput });
    if (!tersimpan) {
        throw new UnauthorizedError("Refresh token tidak dikenali atau sudah dicabut");
    }

    const { iat, exp, ...payloadBersih } = payload as any;

    const accessTokenBaru = buatAccessToken(payloadBersih);
    return { accessToken: accessTokenBaru };
}

export async function logout(refreshTokenInput: string) {
    await refreshRepo.delete({ token: refreshTokenInput });
}