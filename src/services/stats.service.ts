import { AppDataSource } from "../config/database.config";
import { Peserta } from "../entities/Peserta.entity";
import { JurnalHarian } from "../entities/JurnalHarian.entity";
import { Skill } from "../entities/Skill.entity";

export const statsService = {
    async ambilStats() {
        const pesertaRepo = AppDataSource.getRepository(Peserta);
        const jurnalRepo = AppDataSource.getRepository(JurnalHarian);
        const skillRepo = AppDataSource.getRepository(Skill);

        const totalPeserta = await pesertaRepo.count();
        const totalJurnal = await jurnalRepo.count();
        const totalSkill = await skillRepo.count();

        // Aggregate — hitung jurnal per peserta
        const jurnalPerPeserta = await jurnalRepo
            .createQueryBuilder("j")
            .select("j.pesertaId", "pesertaId")
            .addSelect("COUNT(*)", "total")
            .groupBy("j.pesertaId")
            .getRawMany();

        // Jurnal belum review
        const belumReview = await jurnalRepo.count({
            where: { statusReview: "belum" },
        });

        return {
            totalPeserta,
            totalJurnal,
            totalSkill,
            jurnalBelumReview: belumReview,
            jurnalPerPeserta,
        };
    },
};