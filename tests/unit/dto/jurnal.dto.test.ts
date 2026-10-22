import {
  CreateJurnalDto,
  UpdateJurnalDto,
  ReviewJurnalDto,
} from "../../../src/dto/jurnal.dto";
import { validasiDto } from "../../../src/utils/validasi.util";
import { fieldYangGagal } from "../../helpers/dto";

describe("CreateJurnalDto — objek bersarang", () => {
  const dasar = { kegiatan: "Belajar unit testing dengan Jest" };

  it("menerima lampiran yang valid", async () => {
    const hasil = await validasiDto(CreateJurnalDto, {
      ...dasar,
      lampiran: [{ url: "https://contoh.com/ss1.png", keterangan: "tangkapan layar" }],
    });
    expect(hasil.lampiran).toHaveLength(1);
  });

  it("menerima lampiran tanpa keterangan (opsional)", async () => {
    const hasil = await validasiDto(CreateJurnalDto, {
      ...dasar,
      lampiran: [{ url: "https://contoh.com/ss1.png" }],
    });
    expect(hasil.lampiran?.[0].keterangan).toBeUndefined();
  });

  it("melaporkan field bersarang dengan notasi titik", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(CreateJurnalDto, {
        ...dasar,
        lampiran: [{ url: "https://contoh.com/ok.png" }, { url: "bukan-url" }],
      })
    );
    expect(gagal).toContain("lampiran.1.url");
  });

  it("menolak lampiran lebih dari 5 item", async () => {
    const enam = Array.from({ length: 6 }, () => ({ url: "https://contoh.com/x.png" }));
    const gagal = await fieldYangGagal(validasiDto(CreateJurnalDto, { ...dasar, lampiran: enam }));
    expect(gagal).toContain("lampiran");
  });

  it("menolak lampiran yang bukan array", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(CreateJurnalDto, { ...dasar, lampiran: "bukan-array" })
    );
    expect(gagal).toContain("lampiran");
  });

  it("menolak pesertaId dari body (harus dari token)", async () => {
    const gagal = await fieldYangGagal(validasiDto(CreateJurnalDto, { ...dasar, pesertaId: 99 }));
    expect(gagal).toEqual(["pesertaId"]);
  });

  it.each<[string, Record<string, unknown>, string]>([
    ["kegiatan kurang dari 10 karakter", { kegiatan: "belajar" }, "kegiatan"],
    ["kegiatan kosong", { kegiatan: "" }, "kegiatan"],
    ["hambatan lebih dari 200 karakter", { hambatan: "a".repeat(201) }, "hambatan"],
    ["linkCommit bukan URL", { linkCommit: "bukan-url" }, "linkCommit"],
  ])("menolak: %s", async (_judul, ubahan, fieldDiharapkan) => {
    const gagal = await fieldYangGagal(validasiDto(CreateJurnalDto, { ...dasar, ...ubahan }));
    expect(gagal).toContain(fieldDiharapkan);
  });
});

describe("UpdateJurnalDto", () => {
  it("menerima objek kosong (semua field opsional)", async () => {
    const hasil = await validasiDto(UpdateJurnalDto, {});
    expect(hasil).toEqual({});
  });

  it("menerima update sebagian", async () => {
    const hasil = await validasiDto(UpdateJurnalDto, { hambatan: "Jaringan lambat" });
    expect(hasil.hambatan).toBe("Jaringan lambat");
  });

  it("menolak kegiatan kurang dari 10 karakter", async () => {
    const gagal = await fieldYangGagal(validasiDto(UpdateJurnalDto, { kegiatan: "pendek" }));
    expect(gagal).toContain("kegiatan");
  });

  it("menolak pesertaId dari body", async () => {
    const gagal = await fieldYangGagal(validasiDto(UpdateJurnalDto, { pesertaId: 99 }));
    expect(gagal).toEqual(["pesertaId"]);
  });
});

describe("ReviewJurnalDto — validasi bersyarat", () => {
  it("catatan wajib jika statusReview sudah", async () => {
    const gagal = await fieldYangGagal(validasiDto(ReviewJurnalDto, { statusReview: "sudah" }));
    expect(gagal).toContain("catatan");
  });

  it("catatan minimal 5 karakter", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(ReviewJurnalDto, { statusReview: "sudah", catatan: "ok" })
    );
    expect(gagal).toContain("catatan");
  });

  it("catatan boleh kosong jika statusReview belum", async () => {
    await expect(
      validasiDto(ReviewJurnalDto, { statusReview: "belum" })
    ).resolves.toBeDefined();
  });

  it("menerima catatan valid saat sudah", async () => {
    const hasil = await validasiDto(ReviewJurnalDto, {
      statusReview: "sudah",
      catatan: "Sudah direview dengan baik",
    });
    expect(hasil.catatan).toBe("Sudah direview dengan baik");
  });

  it("menolak statusReview di luar whitelist", async () => {
    const gagal = await fieldYangGagal(
      validasiDto(ReviewJurnalDto, { statusReview: "mungkin" })
    );
    expect(gagal).toContain("statusReview");
  });
});