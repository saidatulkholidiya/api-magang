import { ErrorCode } from "../utils/errorCodes";
import { bungkusDaftar, bungkusSukses, contohError, ref, responsError } from "./helpers";

export const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Tempel access token dari POST /auth/login (tanpa kata Bearer).",
    },
  },

  parameters: {
    Page:  { name: "page", in: "query", description: "Nomor halaman (mulai 1)",
             schema: { type: "integer", minimum: 1, default: 1 } },
    Limit: { name: "limit", in: "query", description: "Jumlah data per halaman",
             schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
    Order: { name: "order", in: "query", description: "Arah pengurutan",
             schema: { type: "string", enum: ["ASC", "DESC"], default: "DESC" } },
    Q:     { name: "q", in: "query", description: "Kata kunci pencarian",
             schema: { type: "string", maxLength: 100 } },
    IdPath: { name: "id", in: "path", required: true, description: "ID data",
              schema: { type: "integer", minimum: 1 } },
  },

  headers: {
    XRequestId: {
      description: "ID unik request, gunakan saat melapor error agar mudah dilacak di log",
      schema: { type: "string", format: "uuid" },
    },
  },

  schemas: {
    PaginationMeta: {
      type: "object",
      properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 10 },
        total: { type: "integer", example: 42 },
        totalPages: { type: "integer", example: 5 },
        hasNext: { type: "boolean", example: true },
        hasPrev: { type: "boolean", example: false },
      },
          UpdateProfilRequest: {
      type: "object",
      additionalProperties: false,
      description: "Hanya boleh berisi nama, sekolah, atau telepon. Minimal satu field harus diisi.",
      properties: {
        nama: { type: "string", minLength: 3, maxLength: 100 },
        sekolah: { type: "string", minLength: 3, maxLength: 100 },
        telepon: { type: "string", pattern: "^(\\+62|62|0)8[1-9][0-9]{6,10}$" },
      },
    },

    RefreshRequest: {
      type: "object",
      required: ["refreshToken"],
      additionalProperties: false,
      properties: {
        refreshToken: { type: "string" },
      },
    },

    FieldError: {
      type: "object",
      properties: {
        field: { type: "string", example: "email" },
        pesan: { type: "string", example: "Format email tidak valid" },
      },
    },

    ErrorResponse: {
      type: "object",
      properties: {
        sukses: { type: "boolean", example: false },
        error: {
          type: "object",
          required: ["kode", "pesan"],
          properties: {
            kode: { type: "string", enum: Object.values(ErrorCode) },
            pesan: { type: "string" },
            detail: { type: "array", items: ref("FieldError") },
          },
        },
        requestId: { type: "string", format: "uuid" },
      },
    },

    Peserta: {
      type: "object",
      properties: {
        id: { type: "integer", readOnly: true, example: 1 },
        nama: { type: "string", example: "Budi Santoso" },
        sekolah: { type: "string", example: "SMK 5 Malang" },
        email: { type: "string", format: "email", example: "budi@mail.com" },
        fase: { type: "integer", minimum: 1, maximum: 5, example: 1 },
        status: { type: "string", enum: ["aktif", "lulus", "berhenti"] },
        role: { type: "string", enum: ["peserta", "mentor"] },
        telepon: { type: "string", nullable: true, example: "081234567890" },
        createdAt: { type: "string", format: "date-time", readOnly: true },
      },
    },

    RegisterRequest: {
      type: "object",
      required: ["nama", "sekolah", "email", "password", "konfirmasiPassword"],
      additionalProperties: false,
      properties: {
        nama: { type: "string", minLength: 3, maxLength: 100 },
        sekolah: { type: "string", minLength: 3, maxLength: 100 },
        email: { type: "string", format: "email" },
        password: { type: "string", format: "password", writeOnly: true, minLength: 8, maxLength: 72 },
        konfirmasiPassword: { type: "string", format: "password", writeOnly: true },
      },
    },

    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      additionalProperties: false,
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", format: "password", writeOnly: true },
      },
    },

    PesertaResponse: bungkusSukses(ref("Peserta")),
    PesertaListResponse: bungkusDaftar(ref("Peserta")),
    LoginResponse: bungkusSukses({
      type: "object",
      properties: {
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        peserta: ref("Peserta"),
      },
    }),

    Lampiran: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", format: "uri", example: "https://contoh.com/ss1.png" },
        keterangan: { type: "string", maxLength: 200, example: "Tangkapan layar" },
      },
    },

    Jurnal: {
      type: "object",
      properties: {
        id: { type: "integer", readOnly: true, example: 1 },
        pesertaId: { type: "integer", example: 1 },
        kegiatan: { type: "string", example: "Belajar Swagger UI" },
        hambatan: { type: "string", nullable: true, example: "Sempat error" },
        linkCommit: { type: "string", format: "uri", nullable: true, example: "https://github.com/..." },
        statusReview: { type: "string", enum: ["belum", "sudah"] },
        catatanMentor: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time", readOnly: true },
        lampiran: { type: "array", items: ref("Lampiran") },
      },
    },

    CreateJurnalRequest: {
      type: "object",
      required: ["kegiatan"],
      additionalProperties: false,
      properties: {
        kegiatan: { type: "string", minLength: 10, example: "Belajar Swagger UI" },
        hambatan: { type: "string", maxLength: 200 },
        linkCommit: { type: "string", format: "uri" },
        lampiran: { type: "array", maxItems: 5, items: ref("Lampiran") },
      },
    },

    UpdateJurnalRequest: {
      type: "object",
      additionalProperties: false,
      properties: {
        kegiatan: { type: "string", minLength: 10 },
        hambatan: { type: "string", maxLength: 2000 },
        linkCommit: { type: "string", format: "uri" },
      },
    },

    ReviewJurnalRequest: {
      type: "object",
      required: ["statusReview"],
      additionalProperties: false,
      properties: {
        statusReview: { type: "string", enum: ["belum", "sudah"] },
        catatan: { type: "string", minLength: 5, description: "Wajib jika statusReview='sudah'" },
      },
    },

    JurnalResponse: bungkusSukses(ref("Jurnal")),
    JurnalListResponse: bungkusDaftar(ref("Jurnal")),
  },

  responses: {
    Unauthorized: responsError("Belum login atau token tidak valid", {
      default: { summary: "Akses ditolak", value: contohError("UNAUTHORIZED", "Silakan login terlebih dahulu") },
    }),
    Forbidden: responsError("Tidak berhak melakukan aksi ini", {
      default: { summary: "Akses ditolak", value: contohError("FORBIDDEN", "Kamu tidak berhak") },
    }),
    NotFound: responsError("Data tidak ditemukan", {
      default: { summary: "Data kosong", value: contohError("NOT_FOUND", "Data tidak ditemukan") },
    }),
    Conflict: responsError("Bentrok dengan data yang sudah ada", {
      default: { summary: "Duplikat", value: contohError("CONFLICT", "Data sudah ada") },
    }),
    ValidationError: responsError("Input tidak lolos validasi", {
      default: { summary: "Validasi gagal", value: contohError("VALIDATION_ERROR", "Validasi gagal") },
    }),
    TooManyRequests: responsError("Terlalu banyak percobaan", {
      default: { summary: "Rate limit", value: contohError("RATE_LIMITED", "Coba lagi nanti") },
    }),
  },
}};