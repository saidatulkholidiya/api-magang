import { AppDataSource } from "../config/database.config";
import { Peserta } from "../entities/Peserta.entity";
import { NotFoundError, ConflictError } from "../utils/AppError";
import { ListQuery, escapeLike } from "../utils/pagination";
import { FindOptionsOrder, FindOptionsWhere, ILike } from "typeorm";

const repo = AppDataSource.getRepository(Peserta);

// Kolom yang BOLEH dipakai untuk sorting
export const SORT_PESERTA = ["nama", "fase", "createdAt"] as const;

interface FilterPeserta {
    sekolah?: string;
    fase?: number;
}

export const pesertaService = {
    async daftarPeserta(lq: ListQuery, filter: FilterPeserta) {
        const dasar: FindOptionsWhere<Peserta> = {};
        if (filter.sekolah) dasar.sekolah = filter.sekolah;
        if (filter.fase) dasar.fase = filter.fase;

        // Array di "where" berarti OR: cocokkan nama ATAU email
        const where: FindOptionsWhere<Peserta> | FindOptionsWhere<Peserta>[] = lq.q
            ? [
                { ...dasar, nama: ILike(`%${escapeLike(lq.q)}%`) },
                { ...dasar, email: ILike(`%${escapeLike(lq.q)}%`) },
            ]
            : dasar;

        const [data, total] = await repo.findAndCount({
            where,
            order: { [lq.sortBy]: lq.order } as FindOptionsOrder<Peserta>,
            skip: (lq.page - 1) * lq.limit,
            take: lq.limit,
        });

        return { data, total };
    },

    async ambilById(id: number): Promise<Peserta> {
        const peserta = await repo.findOne({
            where: { id },
            relations: { jurnalList: true, skills: true },
        });
        if (!peserta) throw new NotFoundError("Peserta");
        return peserta;
    },

    async buat(data: { nama: string; sekolah: string; email: string; fase?: number; telepon?: string }): Promise<Peserta> {
        const emailSudahAda = await repo.findOneBy({ email: data.email });
        if (emailSudahAda) throw new ConflictError("Email sudah terdaftar");

        const baru = repo.create({
            nama: data.nama,
            sekolah: data.sekolah,
            email: data.email,
            fase: data.fase ?? 1,
            telepon: data.telepon,
        });
        return repo.save(baru);
    },

    async update(id: number, data: Partial<Peserta>): Promise<Peserta> {
        const peserta = await repo.findOneBy({ id });
        if (!peserta) throw new NotFoundError("Peserta");
        repo.merge(peserta, data);
        return repo.save(peserta);
    },

    async hapus(id: number): Promise<void> {
        const peserta = await repo.findOneBy({ id });
        if (!peserta) throw new NotFoundError("Peserta");
        await repo.remove(peserta);
    },

    async patch(id: number, body: Record<string, unknown>): Promise<Peserta> {
    const peserta = await repo.findOneBy({ id });
    if (!peserta) throw new NotFoundError("Peserta");

    const { nama, sekolah, telepon } = body;

    const perubahan = Object.fromEntries(
        Object.entries({ nama, sekolah, telepon })
            .filter(([, nilai]) => nilai !== undefined)
    );

    repo.merge(peserta, perubahan);
    return repo.save(peserta);
},
};