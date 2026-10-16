import { AppDataSource } from "../config/database.config";
import { JurnalHarian } from "../entities/JurnalHarian.entity";
import { Peserta } from "../entities/Peserta.entity";
import { NotFoundError, ForbiddenError } from "../utils/AppError";
import { escapeLike } from "../utils/pagination";
import { ListJurnalQueryDto } from "../dto/jurnal.dto";
import {
    Between,
    FindOptionsOrder,
    FindOptionsWhere,
    MoreThanOrEqual,
    LessThanOrEqual,
} from "typeorm";

const repo = AppDataSource.getRepository(JurnalHarian);
const pesertaRepo = AppDataSource.getRepository(Peserta);

export const SORT_JURNAL = ["createdAt", "statusReview"] as const;

interface FilterJurnal {
    pesertaId?: number;
    statusReview?: "belum" | "sudah";
    from?: string;
    to?: string;
    belumDireview?: boolean;
}

export const jurnalService = {
    async daftarJurnal(query: ListJurnalQueryDto, filter: FilterJurnal) {
        const dasar: FindOptionsWhere<JurnalHarian> = {};

        if (filter.pesertaId) dasar.pesertaId = filter.pesertaId;
        if (filter.statusReview) dasar.statusReview = filter.statusReview;
        if (filter.belumDireview === true) dasar.statusReview = "belum";

        if (filter.from && filter.to) {
            dasar.createdAt = Between(new Date(filter.from), new Date(filter.to));
        } else if (filter.from) {
            dasar.createdAt = MoreThanOrEqual(new Date(filter.from));
        } else if (filter.to) {
            dasar.createdAt = LessThanOrEqual(new Date(filter.to));
        }

        const [data, total] = await repo.findAndCount({
            where: dasar,
            relations: { peserta: true, reviewer: true },
            order: { [query.sortBy]: query.order } as FindOptionsOrder<JurnalHarian>,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { data, total };
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

    async update(id: number, data: Partial<JurnalHarian>, userId: number, userRole: string): Promise<JurnalHarian> {
        const jurnal = await repo.findOneBy({ id });
        if (!jurnal) throw new NotFoundError("Jurnal");

        if (userRole !== "mentor" && jurnal.pesertaId !== userId) {
            throw new ForbiddenError("Kamu tidak berhak mengubah jurnal ini");
        }

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