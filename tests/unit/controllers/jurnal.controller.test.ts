/// <reference types="node" />
/// <reference types="jest" />

import { Request, Response } from "express";
import * as jurnalController from "../../../src/controllers/jurnal.controller";
import { jurnalService } from "../../../src/services/jurnal.service";
import { JurnalResponseDto } from "../../../src/dto/response/jurnal.response";

// Mock service dan serialisasi
jest.mock("../../../src/services/jurnal.service");
jest.mock("../../../src/utils/serialisasi", () => ({
  serialisasi: jest.fn().mockImplementation((_dto, data) => data),
}));

const mockJurnalService = jurnalService as jest.Mocked<typeof jurnalService>;

describe("JurnalController", () => {
  let mockReq: any;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      user: { id: 1, email: "peserta@mail.com", role: "peserta" } as never,
      body: {},
      params: {},
      query: {},
      validated: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("getJurnalById", () => {
    it("memanggil service dengan id dari params dan mengembalikan hasil", async () => {
      const mockJurnal = { id: 5, kegiatan: "Belajar" };
      mockJurnalService.ambilById.mockResolvedValue(mockJurnal as never);
      mockReq.validated = { params: { id: 5 } };

      await jurnalController.getJurnalById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockJurnalService.ambilById).toHaveBeenCalledWith(5);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockJurnal }));
      expect(mockNext).not.toHaveBeenCalled();
    });

      it("memanggil next(error) jika service melempar error", async () => {
      const error = new Error("Not Found");
      mockJurnalService.ambilById.mockRejectedValue(error);
      mockReq.validated = { params: { id: 99 } };

      // Panggil, lalu tunggu satu tick agar asyncHandler sempat menangkap error
      await jurnalController.getJurnalById(mockReq as Request, mockRes as Response, mockNext);
      await new Promise((resolve) => setImmediate(resolve)); // <-- tambahan ini

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe("buatJurnal", () => {
    it("menyisipkan pesertaId dari token req.user, bukan dari body", async () => {
      mockJurnalService.buat.mockResolvedValue({ id: 10 } as never);
      mockReq.validated = { body: { kegiatan: "Belajar", pesertaId: 999 } }; // 999 sengaja nakal
      mockReq.user = { id: 1, role: "peserta" } as never; // user asli id 1

      await jurnalController.buatJurnal(mockReq as Request, mockRes as Response, mockNext);

      // Service harus dipanggil dengan pesertaId: 1 (dari token), bukan 999 (dari body)
      expect(mockJurnalService.buat).toHaveBeenCalledWith(
        expect.objectContaining({ pesertaId: 1, kegiatan: "Belajar" })
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("hapusJurnal", () => {
    it("mengembalikan 204 tanpa body jika berhasil", async () => {
      mockJurnalService.hapus.mockResolvedValue(undefined);
      mockReq.validated = { params: { id: 10 } };

      await jurnalController.hapusJurnal(mockReq as Request, mockRes as Response, mockNext);

      expect(mockJurnalService.hapus).toHaveBeenCalledWith(10);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });
});