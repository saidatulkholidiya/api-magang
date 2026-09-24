import { AppDataSource } from "../config/database.config";
import { Peserta } from "../entities/Peserta.entity";
import { JurnalHarian } from "../entities/JurnalHarian.entity";

// SOAL 2a: Ambil peserta beserta semua jurnalnya
export async function getPesertaDenganJurnal(id: number) {
    const pesertaRepo = AppDataSource.getRepository(Peserta);
    
    const peserta = await pesertaRepo.findOne({
        where: { id },
        relations: { jurnalList: true },
    });
    
    return peserta;
}

// SOAL 2b: Ambil semua jurnal beserta nama peserta
export async function getJurnalDenganPeserta() {
    const jurnalRepo = AppDataSource.getRepository(JurnalHarian);
    
    const daftarJurnal = await jurnalRepo.find({
        relations: { peserta: true },
    });
    
    return daftarJurnal.map(j => ({
        id: j.id,
        kegiatan: j.kegiatan,
        namaPeserta: j.peserta?.nama ?? "-",
    }));
}