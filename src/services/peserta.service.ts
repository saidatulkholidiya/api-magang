import { AppDataSource } from "../config/database.config";
import { Peserta } from "../entities/Peserta.entity";
import { NotFoundError, ConflictError, ValidationError } from "../utils/AppError";
import { escapeLike } from "../utils/pagination";
import { FindOptionsOrder, FindOptionsWhere, ILike } from "typeorm";
import { UpdateProfilDto, ListPesertaQueryDto } from "../dto/peserta.dto";

const repo = AppDataSource.getRepository(Peserta);

export const SORT_PESERTA = ["nama", "fase", "createdAt"] as const;

interface FilterPeserta {
    sekolah?: string;
    fase?: number;
}

function hanyaYangDiisi<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(([, nilai]) => nilai !== undefined)
    ) as Partial<T>;
}

export const pesertaService = {
    async daftarPeserta(query: ListPesertaQueryDto, filter: FilterPeserta) {
        const dasar: FindOptionsWhere<Peserta> = {};
        if (filter.sekolah) dasar.sekolah = filter.sekolah;
        if (filter.fase) dasar.fase = filter.fase;

        const where: FindOptionsWhere<Peserta> | FindOptionsWhere<Peserta>[] = query.q
            ? [
                { ...dasar, nama: ILike(`%${escapeLike(query.q)}%`) },
                { ...dasar, email: ILike(`%${escapeLike(query.q)}%`) },
            ]
            : dasar;

        const [data, total] = await repo.findAndCount({
            where,
            order: { [query.sortBy]: query.order } as FindOptionsOrder<Peserta>,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
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

    async ubahProfil(id: number, data: UpdateProfilDto): Promise<Peserta> {
        const peserta = await repo.findOneBy({ id });
        if (!peserta) throw new NotFoundError("Peserta");

        const perubahan = hanyaYangDiisi(data);
        if (Object.keys(perubahan).length === 0) {
            throw new ValidationError([
                { field: "body", pesan: "Minimal satu field harus diisi" },
            ]);
        }

        repo.merge(peserta, perubahan);
        return repo.save(peserta);
    },
};