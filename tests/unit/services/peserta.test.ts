import { hanyaYangDiisi } from "../../../src/services/peserta.service";

describe("hanyaYangDiisi", () => {
  it("membuang field yang undefined", () => {
    expect(hanyaYangDiisi({ nama: "Budi", telepon: undefined })).toEqual({
      nama: "Budi",
    });
  });

  it("mempertahankan null (bukan undefined)", () => {
    expect(hanyaYangDiisi({ nama: "Budi", telepon: null })).toEqual({
      nama: "Budi",
      telepon: null,
    });
  });

  it("mempertahankan string kosong", () => {
    expect(hanyaYangDiisi({ nama: "Budi", telepon: "" })).toEqual({
      nama: "Budi",
      telepon: "",
    });
  });

  it("mempertahankan angka 0", () => {
    expect(hanyaYangDiisi({ nama: "Budi", fase: 0 })).toEqual({
      nama: "Budi",
      fase: 0,
    });
  });

  it("objek kosong tetap kosong", () => {
    expect(hanyaYangDiisi({})).toEqual({});
  });

  it("semua field undefined menghasilkan objek kosong", () => {
    expect(hanyaYangDiisi({ a: undefined, b: undefined })).toEqual({});
  });

  it("tidak memutasi objek asli", () => {
    const asli = { nama: "Budi", telepon: undefined };
    hanyaYangDiisi(asli);
    expect(asli).toEqual({ nama: "Budi", telepon: undefined });
  });
});