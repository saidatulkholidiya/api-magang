/// <reference types="node" />
/// <reference types="jest" />

import { buatMockRepo, MockRepo } from "../../helpers/mockRepo";

describe("PesertaService", () => {
  let repo: MockRepo;
  let service: typeof import("../../../src/services/peserta.service").pesertaService;

  beforeEach(() => {
    jest.resetModules();
    repo = buatMockRepo();
    repo.merge.mockImplementation((target, source) => Object.assign(target, source));

    jest.doMock("../../../src/config/database.config", () => ({
      AppDataSource: {
        getRepository: jest.fn().mockReturnValue(repo),
      },
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../../../src/services/peserta.service");
    service = mod.pesertaService;
  });

  afterEach(() => {
    jest.dontMock("../../../src/config/database.config");
  });

  describe("ambilById", () => {
    it("mengembalikan peserta jika ditemukan", async () => {
      const peserta = { id: 1, nama: "Budi" };
      repo.findOne.mockResolvedValue(peserta);

      await expect(service.ambilById(1)).resolves.toEqual(peserta);
    });

    it("melempar NotFoundError jika peserta tidak ada", async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.ambilById(99)).rejects.toThrow("Peserta tidak ditemukan");
    });
  });

  describe("buat", () => {
    const data = { nama: "Budi", sekolah: "SMK 5 Malang", email: "budi@mail.com" };

    it("menyimpan peserta baru jika email belum dipakai", async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue({ ...data });
      repo.save.mockResolvedValue({ id: 1, ...data });

      const hasil = await service.buat(data);

      expect(hasil).toMatchObject({ id: 1, email: "budi@mail.com" });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it("melempar ConflictError dan TIDAK menyimpan jika email sudah terdaftar", async () => {
      repo.findOneBy.mockResolvedValue({ id: 5, email: data.email });

      await expect(service.buat(data)).rejects.toThrow("Email sudah terdaftar");
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe("hapus", () => {
    it("berhasil jika peserta ada", async () => {
      repo.findOneBy.mockResolvedValue({ id: 1 });
      repo.remove.mockResolvedValue({} as never);

      await expect(service.hapus(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledTimes(1);
    });

    it("melempar NotFoundError jika peserta tidak ada", async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.hapus(99)).rejects.toThrow("Peserta tidak ditemukan");
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });

  describe("ubahProfil", () => {
    it("menyimpan perubahan jika ada field yang diisi", async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, nama: "Budi" });
      repo.save.mockImplementation((p) => Promise.resolve(p));

      const hasil = await service.ubahProfil(1, { nama: "Budi Baru" });
      expect(hasil).toEqual({ id: 1, nama: "Budi Baru" });
    });

    it("melempar ValidationError jika tidak ada field yang diisi", async () => {
  repo.findOneBy.mockResolvedValue({ id: 1, nama: "Budi" });

  await expect(service.ubahProfil(1, {})).rejects.toMatchObject({
    detail: [{ field: "body", pesan: "Minimal satu field harus diisi" }],
  });
});

    it("melempar NotFoundError jika peserta tidak ada", async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.ubahProfil(99, { nama: "X" })).rejects.toThrow("Peserta tidak ditemukan");
    });
  });

  describe("daftarPeserta", () => {
    it("mengembalikan data dan total dari findAndCount", async () => {
      repo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

      const hasil = await service.daftarPeserta(
        { page: 1, limit: 10, sortBy: "nama", order: "ASC" } as never,
        {}
      );
      expect(hasil).toEqual({ data: [{ id: 1 }], total: 1 });
    });

    it("memakai ILike jika query.q diisi", async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.daftarPeserta(
        { page: 1, limit: 10, sortBy: "nama", order: "ASC", q: "budi" } as never,
        {}
      );
      const arg = repo.findAndCount.mock.calls[0][0];
      expect(Array.isArray(arg.where)).toBe(true);
    });
  });
});