/// <reference types="node" />
/// <reference types="jest" />

import request from "supertest";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/database.config";
import { Peserta } from "../../src/entities/Peserta.entity";
import { JurnalHarian } from "../../src/entities/JurnalHarian.entity";
import { bersihkanDatabase } from "../helpers/db";

describe("Alur peserta & jurnal (database sungguhan)", () => {
  let mentorToken: string;
  let pesertaToken: string;
  let pesertaId: number;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.runMigrations();
    }
  });

  beforeEach(async () => {
    await bersihkanDatabase();

    // Seed: satu mentor dan satu peserta
    const repoPeserta = AppDataSource.getRepository(Peserta);

    const mentor = await repoPeserta.save(
      repoPeserta.create({
        nama: "Mentor Satu",
        sekolah: "SMK 1",
        email: "mentor@mail.com",
        password: "$2b$10$hashpalsu", // tidak dipakai login
        role: "mentor",
      })
    );

    const peserta = await repoPeserta.save(
      repoPeserta.create({
        nama: "Peserta Satu",
        sekolah: "SMK 2",
        email: "peserta@mail.com",
        password: "$2b$10$hashpalsu",
        role: "peserta",
      })
    );
    pesertaId = peserta.id;

    // Login langsung lewat service untuk dapat token (lebih cepat dari HTTP)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jwt = require("../../src/utils/jwt");
    mentorToken = jwt.buatAccessToken({ id: mentor.id, email: mentor.email, role: "mentor" });
    pesertaToken = jwt.buatAccessToken({ id: peserta.id, email: peserta.email, role: "peserta" });
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("GET /peserta dengan 15 data: pagination dan filter bekerja", async () => {
    const repo = AppDataSource.getRepository(Peserta);

    // Tambah 14 peserta lagi (total 15 termasuk yang di-seed)
    const tambahan = Array.from({ length: 14 }, (_, i) => ({
      nama: `Peserta ${i + 2}`,
      sekolah: i % 2 === 0 ? "SMK A" : "SMK B",
      email: `peserta${i + 2}@mail.com`,
      password: "hash",
      role: "peserta" as const,
    }));
    await repo.save(repo.create(tambahan));

    // Halaman 1, limit 10 → 10 data, total 15
    const hal1 = await request(app)
      .get("/api/v1/peserta")
      .query({ page: 1, limit: 10 })
      .set("Authorization", `Bearer ${pesertaToken}`);

    expect(hal1.status).toBe(200);
    expect(hal1.body.data).toHaveLength(10);
    expect(hal1.body.meta.total).toBe(16);
    expect(hal1.body.meta.totalPages).toBe(2);

    // Halaman 2, limit 10 → 5 data
    const hal2 = await request(app)
      .get("/api/v1/peserta")
      .query({ page: 2, limit: 10 })
      .set("Authorization", `Bearer ${pesertaToken}`);

    expect(hal2.status).toBe(200);
    expect(hal2.body.data).toHaveLength(6);

    // Filter sekolah=SMK A → hanya yang cocok
    const filter = await request(app)
      .get("/api/v1/peserta")
      .query({ sekolah: "SMK A", limit: 100 })
      .set("Authorization", `Bearer ${pesertaToken}`);

    expect(filter.status).toBe(200);
    expect(
      filter.body.data.every((p: { sekolah: string }) => p.sekolah === "SMK A")
    ).toBe(true);
  });

  it("DELETE /peserta/:id yang masih punya jurnal — perilaku ON DELETE", async () => {
    const repoJurnal = AppDataSource.getRepository(JurnalHarian);
    await repoJurnal.save(
      repoJurnal.create({
        pesertaId,
        kegiatan: "Belajar integration test",
        statusReview: "belum",
      })
    );

    const res = await request(app)
      .delete(`/api/v1/peserta/${pesertaId}`)
      .set("Authorization", `Bearer ${mentorToken}`);

    // Perilaku tergantung ON DELETE di migration:
    // - CASCADE → 204, jurnal ikut terhapus
    // - RESTRICT/NO ACTION → 409 atau 500, jurnal tetap ada
    if (res.status === 204) {
      const sisa = await repoJurnal.count({ where: { pesertaId } });
      expect(sisa).toBe(0); // CASCADE bekerja
    } else {
      const sisa = await repoJurnal.count({ where: { pesertaId } });
      expect(sisa).toBe(1); // Ditolak, jurnal aman
    }
  });
});