import { AppDataSource } from "../config/database.config";
import { JurnalHarian } from "../entities/JurnalHarian.entity";
import { Peserta } from "../entities/Peserta.entity";
import { NotFoundError } from "../utils/AppError";

const repo = AppDataSource.getRepository(JurnalHarian);
const pesertaRepo = AppDataSource.getRepository(Peserta);

export const jurnalService = {
    async ambilSemua(pesertaId?: string, status?: string): Promise<JurnalHarian[]> {
        const qb = repo.createQueryBuilder("jurnal")
            .leftJoinAndSelect("jurnal.peserta", "peserta")
            .leftJoinAndSelect("jurnal.reviewer", "reviewer");

        if (pesertaId) {
            qb.andWhere("jurnal.pesertaId = :pesertaId", { pesertaId: Number(pesertaId) });
        }

        if (status) {
            qb.andWhere("jurnal.statusReview = :status", { status });
        }

        qb.orderBy("jurnal.id", "ASC");

        return qb.getMany();
    },

    async ambilById(id: number): Promise<JurnalHarian> {
        const jurnal = await repo.findOne({
            where: { id },
            relations: { peserta: true, reviewer: true },
        });

        if (!jurnal) throw new NotFoundError("Jurnal");
        return jurnal;
    },

    async ambilByPeserta(pesertaId: number): Promise<JurnalHarian[]> {
        const peserta = await pesertaRepo.findOneBy({ id: pesertaId });
        if (!peserta) throw new NotFoundError("Peserta");

        return repo.find({
            where: { pesertaId },
            relations: { reviewer: true },
        });
    },

    async buat(data: { pesertaId: number; kegiatan: string; hambatan?: string; linkCommit?: string }): Promise<JurnalHarian> {
        const peserta = await pesertaRepo.findOneBy({ id: data.pesertaId });
        if (!peserta) throw new NotFoundError("Peserta");

        const baru = repo.create({
            pesertaId: data.pesertaId,
            kegiatan: data.kegiatan,
            hambatan: data.hambatan,
            linkCommit: data.linkCommit,
            statusReview: "belum",
        });

        return repo.save(baru);
    },

    async update(id: number, data: Partial<JurnalHarian>): Promise<JurnalHarian> {
        const jurnal = await repo.findOneBy({ id });
        if (!jurnal) throw new NotFoundError("Jurnal");

        repo.merge(jurnal, data);
        return repo.save(jurnal);
    },

    async review(id: number, status: "belum" | "sudah"): Promise<JurnalHarian> {
        const jurnal = await repo.findOneBy({ id });
        if (!jurnal) throw new NotFoundError("Jurnal");

        jurnal.statusReview = status;
        return repo.save(jurnal);
    },

    async hapus(id: number): Promise<void> {
        const jurnal = await repo.findOneBy({ id });
        if (!jurnal) throw new NotFoundError("Jurnal");

        await repo.remove(jurnal);
    },
};