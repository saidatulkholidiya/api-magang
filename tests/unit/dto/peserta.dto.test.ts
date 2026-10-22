import {
  ListPesertaQueryDto,
  UpdateProfilDto,
  SORT_PESERTA,
} from "../../../src/dto/peserta.dto";
import { IdParamDto } from "../../../src/dto/common.dto";
import { validasiDto } from "../../../src/utils/validasi.util";
import { fieldYangGagal } from "../../helpers/dto";

describe("ListPesertaQueryDto — nilai bawaan & transformasi", () => {
  it("memakai nilai bawaan jika query kosong", async () => {
    const q = await validasiDto(ListPesertaQueryDto, {}, "query");
    expect(q).toMatchObject({ page: 1, limit: 10, order: "DESC", sortBy: "createdAt" });
  });

  it("mengubah string dari query menjadi angka", async () => {
    const q = await validasiDto(ListPesertaQueryDto, { page: "2", limit: "20" }, "query");
    expect(q.page).toBe(2);
    expect(q.limit).toBe(20);
  });

  it("mengubah order huruf kecil ke huruf besar", async () => {
    const q = await validasiDto(ListPesertaQueryDto, { order: "asc" }, "query");
    expect(q.order).toBe("ASC");
  });

  it("mengabaikan parameter asing di query (tidak menolak)", async () => {
    const q = await validasiDto(ListPesertaQueryDto, { foo: "bar" }, "query");
    expect(q).not.toHaveProperty("foo");
  });

  it("memangkas spasi pada q", async () => {
    const q = await validasiDto(ListPesertaQueryDto, { q: "  budi  " }, "query");
    expect(q.q).toBe("budi");
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["page nol", { page: "0" }, "page"],
    ["page bukan angka", { page: "abc" }, "page"],
    ["limit nol", { limit: "0" }, "limit"],
    ["limit melebihi 100", { limit: "1000" }, "limit"],
    ["sortBy di luar whitelist", { sortBy: "password" }, "sortBy"],
    ["order sembarang", { order: "sembarang" }, "order"],
    ["sekolah ganda (array)", { sekolah: ["a", "b"] }, "sekolah"],
    ["fase di luar rentang", { fase: "9" }, "fase"],
    ["fase nol", { fase: "0" }, "fase"],
    ["fase bukan angka", { fase: "abc" }, "fase"],
  ])("menolak: %s", async (_judul, query, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(ListPesertaQueryDto, query, "query"));
    expect(gagal).toContain(fieldDiharapkan);
  });
});

describe("UpdateProfilDto — pencegahan mass assignment", () => {
  it("menerima field yang sah", async () => {
    const hasil = await validasiDto(UpdateProfilDto, {
      nama: "Budi Santoso",
      sekolah: "SMK 5 Malang",
      telepon: "081234567890",
    });
    expect(hasil.nama).toBe("Budi Santoso");
  });

  it("menolak role walau dikirim bersama field yang sah", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(UpdateProfilDto, { nama: "Budi Santoso", role: "mentor" })
    );
    expect(gagal).toEqual(["role"]);
  });

  it("menolak password dan email (tidak boleh diubah lewat endpoint ini)", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(UpdateProfilDto, { password: "baru12345", email: "x@mail.com" })
    );
    expect(gagal).toEqual(expect.arrayContaining(["password", "email"]));
  });

  it("menolak id (tidak boleh diubah lewat body)", async () => {
    const gagal = await fieldYangGagal(validasiDto(UpdateProfilDto, { id: 99 }));
    expect(gagal).toEqual(["id"]);
  });

  it("menerima objek kosong (semua field opsional)", async () => {
    const hasil = await validasiDto(UpdateProfilDto, {});
    expect(hasil).toEqual({});
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["nama hanya 2 karakter", { nama: "Bu" }, "nama"],
    ["telepon format salah", { telepon: "12345" }, "telepon"],
    ["telepon bukan nomor Indonesia", { telepon: "+1234567890" }, "telepon"],
    ["telepon huruf", { telepon: "abcdefghij" }, "telepon"],
  ])("menolak: %s", async (_judul, ubahan, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(UpdateProfilDto, ubahan));
    expect(gagal).toContain(fieldDiharapkan);
  });
});

describe("IdParamDto", () => {
  it("menerima id valid", async () => {
    const hasil = await validasiDto(IdParamDto, { id: "5" }, "params");
    expect(hasil.id).toBe(5);
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["id nol", { id: "0" }, "id"],
    ["id negatif", { id: "-1" }, "id"],
    ["id bukan angka", { id: "abc" }, "id"],
    ["id desimal", { id: "1.5" }, "id"],
  ])("menolak: %s", async (_judul, params, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(IdParamDto, params, "params"));
    expect(gagal).toContain(fieldDiharapkan);
  });
});