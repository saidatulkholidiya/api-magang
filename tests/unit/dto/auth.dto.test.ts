import { RegisterDto, LoginDto } from "../../../src/dto/auth.dto";
import { validasiDto } from "../../../src/utils/validasi.util";
import { fieldYangGagal } from "../../helpers/dto";

describe("RegisterDto", () => {
  const valid = {
    nama: "Budi Santoso",
    sekolah: "SMK 5 Malang",
    email: "budi@mail.com",
    password: "rahasia123",
    konfirmasiPassword: "rahasia123",
  };

  it("menerima payload yang valid", async () => {
    const hasil = await validasiDto(RegisterDto, valid);
    expect(hasil.nama).toBe("Budi Santoso");
  });

  it("menormalkan email: buang spasi tepi dan ubah ke huruf kecil", async () => {
    const hasil = await validasiDto(RegisterDto, { ...valid, email: "  Budi@Mail.COM  " });
    expect(hasil.email).toBe("budi@mail.com");
  });

  it("memangkas spasi di nama", async () => {
    const hasil = await validasiDto(RegisterDto, { ...valid, nama: "  Budi  " });
    expect(hasil.nama).toBe("Budi");
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["nama hanya 2 karakter", { nama: "Bu" }, "nama"],
    ["nama hanya spasi", { nama: "      " }, "nama"],
    ["email salah format", { email: "bukan-email" }, "email"],
    ["password tanpa angka", { password: "hanyahuruf", konfirmasiPassword: "hanyahuruf" }, "password"],
    ["password tanpa huruf", { password: "12345678", konfirmasiPassword: "12345678" }, "password"],
    ["password kurang dari 8 karakter", { password: "a1b2c3", konfirmasiPassword: "a1b2c3" }, "password"],
    ["password lebih dari 72 karakter", { password: "a1".repeat(40), konfirmasiPassword: "a1".repeat(40) }, "password"],
    ["konfirmasi password berbeda", { konfirmasiPassword: "lain12345" }, "konfirmasiPassword"],
    ["properti asing role", { role: "mentor" }, "role"],
    ["properti asing id", { id: 99 }, "id"],
  ])("menolak: %s", async (_judul, ubahan, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(RegisterDto, { ...valid, ...ubahan }));
    expect(gagal).toContain(fieldDiharapkan);
  });

  it("menolak body kosong dan melaporkan semua field wajib", async () => {
    const gagal = await fieldYangGagal(validasiDto(RegisterDto, {}));
    expect(gagal).toEqual(expect.arrayContaining(["nama", "sekolah", "email", "password"]));
  });

  it("menolak body yang bukan objek (array)", async () => {
    const gagal = await fieldYangGagal(validasiDto(RegisterDto, []));
    expect(gagal).toEqual(["body"]);
  });

  it("menolak body null", async () => {
    const gagal = await fieldYangGagal(validasiDto(RegisterDto, null));
    expect(gagal).toEqual(["body"]);
  });

  it("tidak membocorkan nilai password di detail error", async () => {
    try {
      await validasiDto(RegisterDto, { ...valid, password: "123", konfirmasiPassword: "123" });
      fail("seharusnya melempar error");
    } catch (err) {
      expect(JSON.stringify(err)).not.toContain("\"123\"");
    }
  });
});

describe("LoginDto", () => {
  const valid = { email: "budi@mail.com", password: "rahasia123" };

  it("menerima payload valid", async () => {
    const hasil = await validasiDto(LoginDto, valid);
    expect(hasil.email).toBe("budi@mail.com");
  });

  it("menormalkan email", async () => {
    const hasil = await validasiDto(LoginDto, { ...valid, email: "  BUDI@mail.com " });
    expect(hasil.email).toBe("budi@mail.com");
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["email salah format", { email: "bukan-email" }, "email"],
    ["password kosong", { password: "" }, "password"],
    ["password hilang", { password: undefined }, "password"],
  ])("menolak: %s", async (_judul, ubahan, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(LoginDto, { ...valid, ...ubahan }));
    expect(gagal).toContain(fieldDiharapkan);
  });
});