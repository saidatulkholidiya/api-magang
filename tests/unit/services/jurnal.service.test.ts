/// <reference types="node" />
/// <reference types="jest" />

import { buatMockRepo, MockRepo } from "../../helpers/mockRepo";

describe("JurnalService", () => {
  let repoJurnal: MockRepo;
  let repoPeserta: MockRepo;
  let service: typeof import("../../../src/services/jurnal.service").jurnalService;

  beforeEach(() => {
    jest.resetModules();
    repoJurnal = buatMockRepo();
    repoPeserta = buatMockRepo();
    repoJurnal.merge.mockImplementation((t, s) => Object.assign(t, s));

    jest.doMock("../../../src/config/database.config", () => ({
      AppDataSource: {
        getRepository: jest
          .fn()
          .mockReturnValueOnce(repoJurnal)   // pertama: JurnalHarian
          .mockReturnValueOnce(repoPeserta), // kedua: Peserta
      },
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../../../src/services/jurnal.service");
    service = mod.jurnalService;
  });

  afterEach(() => {
    jest.dontMock("../../../src/config/database.config");
  });

  describe("ambilById", () => {
    it("mengembalikan jurnal jika ditemukan", async () => {
      const jurnal = { id: 1, kegiatan: "Belajar" };
      repoJurnal.findOne.mockResolvedValue(jurnal);

      await expect(service.ambilById(1)).resolves.toEqual(jurnal);
    });

    it("melempar NotFoundError jika jurnal tidak ada", async () => {
      repoJurnal.findOne.mockResolvedValue(null);

      await expect(service.ambilById(99)).rejects.toThrow("Jurnal tidak ditemukan");
    });
  });

  describe("update — otorisasi", () => {
    it("peserta TIDAK bisa mengubah jurnal milik peserta lain (ForbiddenError)", async () => {
      repoJurnal.findOneBy.mockResolvedValue({ id: 1, pesertaId: 5 });

      await expect(service.update(1, { kegiatan: "X" }, 2, "peserta")).rejects.toThrow(
        "Kamu tidak berhak mengubah jurnal ini"
      );
      expect(repoJurnal.save).not.toHaveBeenCalled();
    });

    it("peserta BISA mengubah jurnal miliknya sendiri", async () => {
      repoJurnal.findOneBy.mockResolvedValue({ id: 1, pesertaId: 5 });
      repoJurnal.save.mockImplementation((j) => Promise.resolve(j));

      const hasil = await service.update(1, { kegiatan: "Baru" }, 5, "peserta");
      expect(hasil.kegiatan).toBe("Baru");
    });

    it("mentor boleh mengubah jurnal siapa pun", async () => {
      repoJurnal.findOneBy.mockResolvedValue({ id: 1, pesertaId: 5 });
      repoJurnal.save.mockImplementation((j) => Promise.resolve(j));

      const hasil = await service.update(1, { kegiatan: "Baru" }, 99, "mentor");
      expect(hasil.kegiatan).toBe("Baru");
    });

    it("melempar NotFoundError jika jurnal tidak ada", async () => {
      repoJurnal.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, { kegiatan: "X" }, 1, "mentor")).rejects.toThrow(
        "Jurnal tidak ditemukan"
      );
    });
  });

  describe("review", () => {
    it("mentor mengubah statusReview dan catatanMentor", async () => {
      repoJurnal.findOneBy.mockResolvedValue({ id: 1, statusReview: "belum" });
      repoJurnal.save.mockImplementation((j) => Promise.resolve(j));

      const hasil = await service.review(1, "sudah", "Bagus");
      expect(hasil.statusReview).toBe("sudah");
      expect(hasil.catatanMentor).toBe("Bagus");
    });

    it("melempar NotFoundError jika jurnal tidak ada", async () => {
      repoJurnal.findOneBy.mockResolvedValue(null);

      await expect(service.review(99, "sudah", "X")).rejects.toThrow("Jurnal tidak ditemukan");
    });
  });

  describe("buat", () => {
    it("menyimpan jurnal baru jika peserta ada", async () => {
      repoPeserta.findOneBy.mockResolvedValue({ id: 1 });
      repoJurnal.create.mockReturnValue({ kegiatan: "Belajar" });
      repoJurnal.save.mockResolvedValue({ id: 10, kegiatan: "Belajar", statusReview: "belum" });

      const hasil = await service.buat({ pesertaId: 1, kegiatan: "Belajar" });
      expect(hasil).toMatchObject({ id: 10, statusReview: "belum" });
    });

    it("melempar NotFoundError jika peserta tidak ada", async () => {
      repoPeserta.findOneBy.mockResolvedValue(null);

      await expect(service.buat({ pesertaId: 99, kegiatan: "X" })).rejects.toThrow(
        "Peserta tidak ditemukan"
      );
      expect(repoJurnal.save).not.toHaveBeenCalled();
    });
  });

  describe("hapus", () => {
    it("melempar NotFoundError jika jurnal tidak ada", async () => {
      repoJurnal.findOneBy.mockResolvedValue(null);

      await expect(service.hapus(99)).rejects.toThrow("Jurnal tidak ditemukan");
    });
  });
});