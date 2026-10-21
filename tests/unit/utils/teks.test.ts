import { potongTeks } from "../../../src/utils/teks";

describe("potongTeks", () => {
  it("tidak memotong teks yang tidak melebihi batas", () => {
    expect(potongTeks("halo", 10)).toBe("halo");
  });

  it("memotong dan menambah titik tiga jika melebihi batas", () => {
    expect(potongTeks("Belajar TypeScript", 10)).toBe("Belajar...");
  });

  it("teks kosong tetap kosong", () => {
    expect(potongTeks("", 5)).toBe("");
  });

  it("teks tepat sama dengan batas tidak dipotong", () => {
    expect(potongTeks("12345", 5)).toBe("12345");
  });

  it("max = 3 menghasilkan hanya titik tiga", () => {
    expect(potongTeks("abcdef", 3)).toBe("...");
  });

  it("max = 2 menghasilkan '...' (melebihi batas, keputusan desain)", () => {
    expect(potongTeks("abcdef", 2)).toBe("...");
  });
});