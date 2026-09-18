import { jurnalRepository, pesertaRepository } from "../repositories";
import { NotFoundError, ValidationError } from "../utils/AppError";
import { Jurnal, JurnalBody, JurnalQuery } from "../types";

export const jurnalService = {
    ambilSemua(query: JurnalQuery): Jurnal[] {
        let hasil = jurnalRepository.findAll();

        if (query.peserta) {
            hasil = hasil.filter(j => j.pesertaId === Number(query.peserta));
        }

        if (query.status) {
            hasil = hasil.filter(j => j.status === query.status);
        }

        return hasil;
    },

    ambilById(id: number): Jurnal {
        const jurnal = jurnalRepository.findById(id);
        if (!jurnal) throw new NotFoundError("Jurnal");
        return jurnal;
    },

    ambilByPeserta(pesertaId: number): Jurnal[] {
        pesertaRepository.findById(pesertaId) || (() => { throw new NotFoundError("Peserta"); })();
        return jurnalRepository.findByPesertaId(pesertaId);
    },

    buat(data: JurnalBody): Jurnal {
        const errors: string[] = [];
        if (!data.pesertaId) errors.push("PesertaId wajib diisi");
        if (!data.kegiatan || data.kegiatan.trim().length < 10) errors.push("Kegiatan minimal 10 karakter");
        if (errors.length > 0) throw new ValidationError(errors);

        if (!pesertaRepository.findById(data.pesertaId)) {
            throw new NotFoundError("Peserta");
        }

        return jurnalRepository.create({
            id: jurnalRepository.nextId(),
            pesertaId: data.pesertaId,
            kegiatan: data.kegiatan,
            status: data.status || "belum",
            tanggal: new Date().toISOString().slice(0, 10)
        });
    },

    update(id: number, data: JurnalBody): Jurnal {
        jurnalRepository.findById(id) || (() => { throw new NotFoundError("Jurnal"); })();

        if (data.kegiatan && data.kegiatan.trim().length < 10) {
            throw new ValidationError(["Kegiatan minimal 10 karakter"]);
        }

        const hasil = jurnalRepository.update(id, data);
        if (!hasil) throw new NotFoundError("Jurnal");
        return hasil;
    },

    review(id: number, status: "selesai" | "belum"): Jurnal {
        const hasil = jurnalRepository.update(id, { status });
        if (!hasil) throw new NotFoundError("Jurnal");
        return hasil;
    },

    hapus(id: number): void {
        const berhasil = jurnalRepository.delete(id);
        if (!berhasil) throw new NotFoundError("Jurnal");
    }
};