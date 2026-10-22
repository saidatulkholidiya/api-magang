/// <reference types="node" />
/// <reference types="jest" />

jest.mock("../../src/services/peserta.service");
jest.mock("../../src/services/jurnal.service");
jest.mock("../../src/services/auth.service");

import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app";
import { config } from "../../src/config/env.config";
import { bearer, tokenMentor, tokenPeserta } from "../helpers/token";
import { pesertaService } from "../../src/services/peserta.service";
import { jurnalService } from "../../src/services/jurnal.service";
import { ConflictError, NotFoundError } from "../../src/utils/AppError";

const mockPeserta = pesertaService as jest.Mocked<typeof pesertaService>;
const mockJurnal = jurnalService as jest.Mocked<typeof jurnalService>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Autentikasi", () => {
  it("401 UNAUTHORIZED jika tidak ada token", async () => {
    const res = await request(app).get("/api/v1/me");
    expect(res.status).toBe(401);
    expect(res.body.sukses).toBe(false);
    expect(res.body.error.kode).toBe("UNAUTHORIZED");
  });

  it("401 INVALID_TOKEN untuk token asal-asalan", async () => {
    const res = await request(app).get("/api/v1/me").set("Authorization", "Bearer token-palsu");
    expect(res.status).toBe(401);
    expect(res.body.error.kode).toBe("INVALID_TOKEN");
  });

  it("401 TOKEN_EXPIRED untuk token kedaluwarsa", async () => {
    const kedaluwarsa = jwt.sign(
      { id: 1, email: "a@mail.com", role: "peserta", exp: Math.floor(Date.now() / 1000) - 60 },
      config.jwt.secret
    );
    const res = await request(app).get("/api/v1/me").set("Authorization", bearer(kedaluwarsa));
    expect(res.status).toBe(401);
    expect(res.body.error.kode).toBe("TOKEN_EXPIRED");
  });
});

describe("Otorisasi (role)", () => {
  it("403 FORBIDDEN jika peserta mengakses daftar jurnal (khusus mentor)", async () => {
    const res = await request(app).get("/api/v1/jurnal").set("Authorization", bearer(tokenPeserta()));
    expect(res.status).toBe(403);
    expect(res.body.error.kode).toBe("FORBIDDEN");
    expect(mockJurnal.daftarJurnal).not.toHaveBeenCalled();
  });

  it("200 dengan meta pagination jika mentor mengakses daftar jurnal", async () => {
    mockJurnal.daftarJurnal.mockResolvedValue({ data: [], total: 0 } as never);
    const res = await request(app).get("/api/v1/jurnal").set("Authorization", bearer(tokenMentor()));
    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({
      page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false,
    });
  });
});

describe("Validasi input", () => {
  it("422 dengan detail per field untuk register yang tidak valid", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ nama: "Bu", email: "bukan-email", password: "123" });
    expect(res.status).toBe(422);
    expect(res.body.error.kode).toBe("VALIDATION_ERROR");
    const fields = res.body.error.detail.map((d: { field: string }) => d.field);
    expect(fields).toEqual(expect.arrayContaining(["nama", "email", "password"]));
  });

  it("422 jika id di URL bukan angka", async () => {
    const res = await request(app).get("/api/v1/peserta/abc").set("Authorization", bearer(tokenPeserta()));
    expect(res.status).toBe(422);
    expect(res.body.error.detail[0].field).toBe("id");
  });

  it("422 jika limit melebihi batas", async () => {
    const res = await request(app)
      .get("/api/v1/jurnal")
      .query({ limit: 1000 })
      .set("Authorization", bearer(tokenMentor()));
    expect(res.status).toBe(422);
  });

  it("422 dan service TIDAK dipanggil saat PATCH /me membawa role (mass assignment)", async () => {
    const res = await request(app)
      .patch("/api/v1/me")
      .set("Authorization", bearer(tokenPeserta()))
      .send({ nama: "Budi Santoso", role: "mentor" });
    expect(res.status).toBe(422);
    expect(res.body.error.detail).toEqual([{ field: "role", pesan: "Properti ini tidak diizinkan" }]);
    expect(mockPeserta.ubahProfil).not.toHaveBeenCalled();
  });

  it("urutan middleware: tanpa token dan body rusak tetap 401, bukan 422", async () => {
    const res = await request(app).post("/api/v1/jurnal").send({});
    expect(res.status).toBe(401);
  });
});

describe("Penanganan error", () => {
  it("400 INVALID_JSON untuk body JSON yang rusak", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send("{rusak");
    expect(res.status).toBe(400);
    expect(res.body.error.kode).toBe("INVALID_JSON");
  });

  it("413 PAYLOAD_TOO_LARGE untuk body lebih dari 1 MB", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "a@mail.com", password: "x".repeat(2 * 1024 * 1024) });
    expect(res.status).toBe(413);
    expect(res.body.error.kode).toBe("PAYLOAD_TOO_LARGE");
  });

  it("404 NOT_FOUND untuk route yang tidak ada", async () => {
    const res = await request(app).get("/api/v1/tidak-ada");
    expect(res.status).toBe(404);
    expect(res.body.error.kode).toBe("NOT_FOUND");
  });

  it("500 dengan pesan generik, tanpa membocorkan penyebab", async () => {
    mockJurnal.daftarJurnal.mockRejectedValue(new Error("koneksi db putus: password=rahasia"));
    const res = await request(app).get("/api/v1/jurnal").set("Authorization", bearer(tokenMentor()));
    expect(res.status).toBe(500);
    expect(res.body.error.kode).toBe("INTERNAL_ERROR");
    expect(res.body.error.pesan).toBe("Terjadi kesalahan di server");
  });

  it("requestId dari header diteruskan ke header dan body response", async () => {
    const res = await request(app).get("/api/v1/tidak-ada").set("X-Request-Id", "abc-123");
    expect(res.headers["x-request-id"]).toBe("abc-123");
    expect(res.body.requestId).toBe("abc-123");
  });
});

describe("Response DTO", () => {
  it("password tidak pernah ikut keluar walau service mengembalikannya", async () => {
    mockPeserta.ambilById.mockResolvedValue({
      id: 1, nama: "Budi", email: "budi@mail.com", password: "HASH_RAHASIA",
    } as never);
    const res = await request(app).get("/api/v1/peserta/1").set("Authorization", bearer(tokenPeserta()));
    expect(res.status).toBe(200);
    expect(res.body.data).not.toHaveProperty("password");
    expect(JSON.stringify(res.body)).not.toContain("HASH_RAHASIA");
  });
  describe("SOAL 3 — Test tambahan", () => {
  // a. register sukses → 201, body tanpa password
  it("POST /auth/register sukses → 201 dan body tidak memuat password", async () => {
    const mockAuth = (await import("../../src/services/auth.service")) as jest.Mocked<typeof import("../../src/services/auth.service")>;
    mockAuth.register.mockResolvedValue({
      id: 1, nama: "Budi", sekolah: "SMK 5", email: "budi@mail.com",
    } as never);
    const res = await request(app).post("/api/v1/auth/register").send({
      nama: "Budi Santoso", sekolah: "SMK 5 Malang",
      email: "budi@mail.com", password: "rahasia123", konfirmasiPassword: "rahasia123",
    });
    expect(res.status).toBe(201);
    expect(res.body.data).not.toHaveProperty("password");
  });

  // b. register email duplikat → 409
  it("POST /auth/register email duplikat → 409 CONFLICT", async () => {
    const mockAuth = (await import("../../src/services/auth.service")) as jest.Mocked<typeof import("../../src/services/auth.service")>;
    mockAuth.register.mockRejectedValue(new ConflictError("Email sudah terdaftar"));
    const res = await request(app).post("/api/v1/auth/register").send({
      nama: "Budi Santoso", sekolah: "SMK 5 Malang",
      email: "budi@mail.com", password: "rahasia123", konfirmasiPassword: "rahasia123",
    });
    expect(res.status).toBe(409);
    expect(res.body.error.kode).toBe("CONFLICT");
  });

  // c. login kredensial salah → 401
  it("POST /auth/login kredensial salah → 401 UNAUTHORIZED", async () => {
    const mockAuth = (await import("../../src/services/auth.service")) as jest.Mocked<typeof import("../../src/services/auth.service")>;
    const { UnauthorizedError } = await import("../../src/utils/AppError");
    mockAuth.login.mockRejectedValue(new UnauthorizedError("Email atau password salah"));
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "budi@mail.com", password: "salah123",
    });
    expect(res.status).toBe(401);
    expect(res.body.error.kode).toBe("UNAUTHORIZED");
  });

  // d. GET /peserta dengan query lengkap → service menerima nilai benar
  it("GET /peserta dengan query lengkap → service menerima nilai yang benar", async () => {
    mockPeserta.daftarPeserta.mockResolvedValue({ data: [], total: 0 } as never);
    await request(app).get("/api/v1/peserta").query({
      page: 2, limit: 5, q: "budi", sortBy: "nama", order: "asc", fase: 3,
    });
    expect(mockPeserta.daftarPeserta).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 5, q: "budi", sortBy: "nama", order: "ASC", fase: 3 }),
      expect.any(Object)
    );
  });

  // e. GET /peserta?sortBy=password → 422
  it("GET /peserta?sortBy=password → 422", async () => {
    const res = await request(app).get("/api/v1/peserta").query({ sortBy: "password" });
    expect(res.status).toBe(422);
    expect(res.body.error.detail.map((d: { field: string }) => d.field)).toContain("sortBy");
  });

  // f. DELETE /peserta/1 sukses → 204 tanpa body
  it("DELETE /peserta/1 sebagai mentor → 204 tanpa body", async () => {
    mockPeserta.hapus.mockResolvedValue(undefined as never);
    const res = await request(app)
      .delete("/api/v1/peserta/1")
      .set("Authorization", bearer(tokenMentor()));
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  // g. DELETE /peserta/99 (NotFoundError) → 404
  it("DELETE /peserta/99 → 404 NOT_FOUND", async () => {
    mockPeserta.hapus.mockRejectedValue(new NotFoundError("Peserta"));
    const res = await request(app)
      .delete("/api/v1/peserta/99")
      .set("Authorization", bearer(tokenMentor()));
    expect(res.status).toBe(404);
    expect(res.body.error.kode).toBe("NOT_FOUND");
  });

  // h. review sebagai peserta → 403
  it("PATCH /jurnal/1/review sebagai peserta → 403 FORBIDDEN", async () => {
    const res = await request(app)
      .patch("/api/v1/jurnal/1/review")
      .set("Authorization", bearer(tokenPeserta()))
      .send({ statusReview: "sudah", catatan: "Sudah direview" });
    expect(res.status).toBe(403);
    expect(res.body.error.kode).toBe("FORBIDDEN");
  });

  // h (lanjutan). review mentor tanpa catatan padahal status sudah → 422
  it("PATCH /jurnal/1/review sebagai mentor tanpa catatan → 422", async () => {
    const res = await request(app)
      .patch("/api/v1/jurnal/1/review")
      .set("Authorization", bearer(tokenMentor()))
      .send({ statusReview: "sudah" });
    expect(res.status).toBe(422);
    expect(res.body.error.detail.map((d: { field: string }) => d.field)).toContain("catatan");
  });

  // i. GET /health → 200
  it("GET /health → 200 status ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  // j. X-Request-Id selalu ada, termasuk pada response error
  it("X-Request-Id ada di response error", async () => {
    const res = await request(app).get("/api/v1/tidak-ada");
    expect(res.headers["x-request-id"]).toBeDefined();
    expect(res.body.requestId).toBeDefined();
  });
});
});