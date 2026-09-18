import { pesertaRepository } from "../repositories";
import { NotFoundError, ValidationError } from "../utils/AppError";
import { Peserta, PesertaBody, PesertaQuery } from "../types";

export const pesertaService = {
    ambilSemua(query: PesertaQuery): Peserta[] {
        let hasil = pesertaRepository.findAll();

        if (query.sekolah) {
            hasil = hasil.filter(p =>
                p.sekolah.toLowerCase().includes(String(query.sekolah).toLowerCase())
            );
        }

        if (query.fase) {
            hasil = hasil.filter(p => p.fase === Number(query.fase));
        }

        if (query.limit) {
            hasil = hasil.slice(0, Number(query.limit));
        }

        return hasil;
    },

    ambilById(id: number): Peserta {
        const peserta = pesertaRepository.findById(id);
        if (!peserta) throw new NotFoundError("Peserta");
        return peserta;
    },

    buat(data: PesertaBody): Peserta {
        const errors: string[] = [];
        if (!data.nama || data.nama.trim().length < 3) errors.push("Nama minimal 3 karakter");
        if (!data.sekolah) errors.push("Sekolah wajib diisi");
        if (errors.length > 0) throw new ValidationError(errors);

        return pesertaRepository.create({
            id: pesertaRepository.nextId(),
            nama: data.nama,
            sekolah: data.sekolah,
            fase: data.fase || 1
        });
    },

    update(id: number, data: PesertaBody): Peserta {
        pesertaRepository.findById(id) || (() => { throw new NotFoundError("Peserta"); })();
        const hasil = pesertaRepository.update(id, data);
        if (!hasil) throw new NotFoundError("Peserta");
        return hasil;
    },

    hapus(id: number): void {
        const berhasil = pesertaRepository.delete(id);
        if (!berhasil) throw new NotFoundError("Peserta");
    }
};