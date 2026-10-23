/// <reference types="node" />
/// <reference types="jest" />

import { buatMockRepo, MockRepo } from "../../helpers/mockRepo";

describe("AuthService", () => {
  let repo: MockRepo;
  let refreshRepo: MockRepo;
  let service: typeof import("../../../src/services/auth.service");
  let mockHash: jest.Mock;
  let mockCek: jest.Mock;
  let mockAccess: jest.Mock;
  let mockRefresh: jest.Mock;
  let mockVerifyRefresh: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    repo = buatMockRepo();
    refreshRepo = buatMockRepo();

    mockHash = jest.fn();
    mockCek = jest.fn();
    mockAccess = jest.fn().mockReturnValue("ACCESS_TOKEN");
    mockRefresh = jest.fn().mockReturnValue("REFRESH_TOKEN");
    mockVerifyRefresh = jest.fn();

    jest.doMock("../../../src/config/database.config", () => ({
      AppDataSource: {
        getRepository: jest
          .fn()
          .mockReturnValueOnce(repo)        // pertama: Peserta
          .mockReturnValueOnce(refreshRepo), // kedua: RefreshToken
      },
    }));

    jest.doMock("../../../src/utils/password", () => ({
      hashPassword: mockHash,
      cekPassword: mockCek,
    }));

    jest.doMock("../../../src/utils/jwt", () => ({
      buatAccessToken: mockAccess,
      buatRefreshToken: mockRefresh,
      verifikasiRefreshToken: mockVerifyRefresh,
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    service = require("../../../src/services/auth.service");
  });

  afterEach(() => {
    jest.dontMock("../../../src/config/database.config");
    jest.dontMock("../../../src/utils/password");
    jest.dontMock("../../../src/utils/jwt");
  });

  describe("register", () => {
    const data = {
      nama: "Budi", sekolah: "SMK 5", email: "budi@mail.com",
      password: "rahasia123", konfirmasiPassword: "rahasia123",
    };

    it("melempar ConflictError dan TIDAK menyimpan jika email sudah ada", async () => {
      repo.findOneBy.mockResolvedValue({ id: 5, email: data.email });

      await expect(service.register(data)).rejects.toThrow("Email sudah terdaftar");
      expect(repo.save).not.toHaveBeenCalled();
    });

    it("menyimpan HASH password, bukan password asli", async () => {
      repo.findOneBy.mockResolvedValue(null);
      mockHash.mockResolvedValue("HASH_PALSU");
      repo.create.mockImplementation((d) => d);
      repo.save.mockImplementation((p) => Promise.resolve({ id: 1, ...p }));

      await service.register(data);

      expect(mockHash).toHaveBeenCalledWith("rahasia123");
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: "HASH_PALSU" })
      );
    });

    it("hasil register tidak mengandung properti password", async () => {
      repo.findOneBy.mockResolvedValue(null);
      mockHash.mockResolvedValue("HASH_PALSU");
      repo.create.mockImplementation((d) => d);
      repo.save.mockImplementation((p) => Promise.resolve({ id: 1, ...p }));

      const hasil = await service.register(data);
      expect(hasil).not.toHaveProperty("password");
    });
  });

  describe("login", () => {
    function mockQueryBuilder(getOneResult: unknown) {
      repo.createQueryBuilder.mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(getOneResult),
      });
    }

    it("email tidak ditemukan → UnauthorizedError", async () => {
      mockQueryBuilder(null);

      await expect(service.login({ email: "x@mail.com", password: "y" }))
        .rejects.toThrow("Email atau password salah");
    });

    it("password salah → UnauthorizedError dengan pesan SAMA", async () => {
      mockQueryBuilder({ id: 1, email: "x@mail.com", password: "HASH", role: "peserta" });
      mockCek.mockResolvedValue(false);

      await expect(service.login({ email: "x@mail.com", password: "salah" }))
        .rejects.toThrow("Email atau password salah");
    });

    it("pesan error email-tidak-ada dan password-salah HARUS identik", async () => {
      mockQueryBuilder(null);
      let pesanEmail = "";
      try { await service.login({ email: "x@mail.com", password: "y" }); }
      catch (e) { pesanEmail = (e as Error).message; }

      mockQueryBuilder({ id: 1, email: "x@mail.com", password: "HASH", role: "peserta" });
      mockCek.mockResolvedValue(false);
      let pesanPassword = "";
      try { await service.login({ email: "x@mail.com", password: "salah" }); }
      catch (e) { pesanPassword = (e as Error).message; }

      expect(pesanEmail).toBe(pesanPassword);
    });

    it("sukses → mengembalikan accessToken dan refreshToken", async () => {
      mockQueryBuilder({ id: 1, email: "x@mail.com", password: "HASH", role: "peserta" });
      mockCek.mockResolvedValue(true);
      refreshRepo.save.mockResolvedValue({});

      const hasil = await service.login({ email: "x@mail.com", password: "y" });
      expect(hasil.accessToken).toBe("ACCESS_TOKEN");
      expect(hasil.refreshToken).toBe("REFRESH_TOKEN");
    });

    it("sukses → refresh token disimpan dengan expiresAt tepat 7 hari", async () => {
      const now = new Date("2026-10-19T00:00:00Z").getTime();
      jest.spyOn(Date, "now").mockReturnValue(now);

      mockQueryBuilder({ id: 1, email: "x@mail.com", password: "HASH", role: "peserta" });
      mockCek.mockResolvedValue(true);
      refreshRepo.save.mockResolvedValue({});

      await service.login({ email: "x@mail.com", password: "y" });

      expect(refreshRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          expiresAt: new Date("2026-10-26T00:00:00Z"),
        })
      );

      jest.restoreAllMocks();
    });
  });

  describe("refresh", () => {
    it("refresh token tidak ada di database → UnauthorizedError", async () => {
      mockVerifyRefresh.mockReturnValue({ id: 1, email: "x@mail.com", role: "peserta" });
      refreshRepo.findOneBy.mockResolvedValue(null);

      await expect(service.refresh("TOKEN")).rejects.toThrow(
        "Refresh token tidak dikenali atau sudah dicabut"
      );
    });
  });

  describe("logout", () => {
    it("memanggil delete dengan token yang benar", async () => {
      refreshRepo.delete.mockResolvedValue({});

      await service.logout("TOKEN_X");

      expect(refreshRepo.delete).toHaveBeenCalledWith({ token: "TOKEN_X" });
    });
  });
});