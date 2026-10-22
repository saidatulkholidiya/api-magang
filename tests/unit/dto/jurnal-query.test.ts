import { ListJurnalQueryDto } from "../../../src/dto/jurnal.dto";
import { validasiDto } from "../../../src/utils/validasi.util";
import { fieldYangGagal } from "../../helpers/dto";

describe("ListJurnalQueryDto — transformasi boolean", () => {
  it("belumDireview=false benar-benar bernilai false (bukan true)", async () => {
    const q = await validasiDto(ListJurnalQueryDto, { belumDireview: "false" }, "query");
    expect(q.belumDireview).toBe(false);
  });

  it("belumDireview=true benar-benar bernilai true", async () => {
    const q = await validasiDto(ListJurnalQueryDto, { belumDireview: "true" }, "query");
    expect(q.belumDireview).toBe(true);
  });

  it("belumDireview tidak dikirim tetap undefined", async () => {
    const q = await validasiDto(ListJurnalQueryDto, {}, "query");
    expect(q.belumDireview).toBeUndefined();
  });

  it("belumDireview=abc ditolak", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(ListJurnalQueryDto, { belumDireview: "abc" }, "query")
    );
    expect(gagal).toContain("belumDireview");
  });
});

describe("ListJurnalQueryDto — filter tanggal dan status", () => {
  it("menerima tanggal ISO valid", async () => {
    const q = await validasiDto(
      ListJurnalQueryDto,
      { from: "2026-09-01", to: "2026-09-30" },
      "query"
    );
    expect(q.from).toBe("2026-09-01");
    expect(q.to).toBe("2026-09-30");
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["from bukan tanggal", { from: "kemarin" }, "from"],
    ["to bukan tanggal", { to: "besok" }, "to"],
    ["statusReview di luar whitelist", { statusReview: "mungkin" }, "statusReview"],
    ["sortBy di luar whitelist", { sortBy: "password" }, "sortBy"],
    ["pesertaId bukan angka", { pesertaId: "abc" }, "pesertaId"],
    ["pesertaId nol", { pesertaId: "0" }, "pesertaId"],
  ])("menolak: %s", async (_judul, query, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(ListJurnalQueryDto, query, "query"));
    expect(gagal).toContain(fieldDiharapkan);
  });
});