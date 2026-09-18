import { Request, Response } from "express";
import { dataPeserta, dataJurnal } from "../data/dummy";
import { Peserta, PesertaBody, PesertaQuery } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { NotFoundError, ValidationError } from "../utils/AppError";

// GET /api/peserta
export const getSemuaPeserta = asyncHandler(async (req: Request<{}, {}, {}, PesertaQuery>, res: Response) => {
    const { sekolah, fase, limit } = req.query;
    let hasil = dataPeserta;

    if (sekolah) {
        hasil = hasil.filter(p => p.sekolah.toLowerCase().includes(String(sekolah).toLowerCase()));
    }

    if (fase) {
        hasil = hasil.filter(p => p.fase === Number(fase));
    }

    if (limit) {
        hasil = hasil.slice(0, Number(limit));
    }

    res.json({ sukses: true, total: hasil.length, data: hasil });
});

// GET /api/peserta/:id
export const getPesertaById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const peserta = dataPeserta.find(p => p.id === id);

    if (!peserta) {
        throw new NotFoundError("Peserta");
    }

    res.json({ sukses: true, data: peserta });
});

// POST /api/peserta
export const buatPeserta = asyncHandler(async (req: Request<{}, {}, PesertaBody>, res: Response) => {
    const { nama, sekolah, fase } = req.body;

    const errors: string[] = [];
    if (!nama || nama.trim().length < 3) errors.push("Nama minimal 3 karakter");
    if (!sekolah) errors.push("Sekolah wajib diisi");
    if (errors.length > 0) throw new ValidationError(errors);

    const idBaru = dataPeserta.length > 0
        ? Math.max(...dataPeserta.map(p => p.id)) + 1
        : 1;

    const pesertaBaru: Peserta = { id: idBaru, nama, sekolah, fase: fase || 1 };
    dataPeserta.push(pesertaBaru);

    res.status(201).json({ sukses: true, data: pesertaBaru });
});

// PUT /api/peserta/:id
export const updatePeserta = asyncHandler(async (req: Request<{ id: string }, {}, PesertaBody>, res: Response) => {
    const id = Number(req.params.id);
    const index = dataPeserta.findIndex(p => p.id === id);

    if (index === -1) throw new NotFoundError("Peserta");

    const pesertaLama = dataPeserta[index];
    if (!pesertaLama) throw new NotFoundError("Peserta");

    const { nama, sekolah, fase } = req.body;
    dataPeserta[index] = {
        ...pesertaLama,
        nama: nama ?? pesertaLama.nama,
        sekolah: sekolah ?? pesertaLama.sekolah,
        fase: fase ?? pesertaLama.fase
    };

    res.json({ sukses: true, data: dataPeserta[index] });
});

// DELETE /api/peserta/:id
export const hapusPeserta = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = dataPeserta.findIndex(p => p.id === id);

    if (index === -1) throw new NotFoundError("Peserta");

    dataPeserta.splice(index, 1);
    res.status(204).send();
});

// GET /api/peserta/:id/jurnal
export const getJurnalPeserta = asyncHandler(async (req: Request, res: Response) => {
    const pesertaId = Number(req.params.id);
    const peserta = dataPeserta.find(p => p.id === pesertaId);

    if (!peserta) throw new NotFoundError("Peserta");

    const jurnal = dataJurnal.filter(j => j.pesertaId === pesertaId);
    res.json({ sukses: true, peserta: peserta.nama, total: jurnal.length, data: jurnal });
});