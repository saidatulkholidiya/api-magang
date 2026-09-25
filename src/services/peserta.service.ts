import { AppDataSource } from "../config/database.config";
import { Peserta } from "../entities/Peserta.entity";
import { NotFoundError, ConflictError } from "../utils/AppError";

const repo = AppDataSource.getRepository(Peserta);

export const pesertaService = {
    async ambilSemua(sekolah?: string, fase?: string, limit?: string): Promise<Peserta[]> {
        const qb = repo.createQueryBuilder("peserta")
            .leftJoinAndSelect("peserta.jurnalList", "jurnal")
            .leftJoinAndSelect("peserta.skills", "skill");

        if (sekolah) {
            qb.andWhere("peserta.sekolah ILIKE :sekolah", { sekolah: `%${sekolah}%` });
        }

        if (fase) {
            qb.andWhere("peserta.fase = :fase", { fase: Number(fase) });
        }

        qb.orderBy("peserta.id", "ASC");

        if (limit) {
            qb.take(Number(limit));
        }

        return qb.getMany();
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
};