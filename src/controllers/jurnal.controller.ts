import { Request, Response } from "express";
import { dataJurnal, dataPeserta } from "../data/dummy";
import { Jurnal, JurnalBody, JurnalQuery } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { NotFoundError, ValidationError } from "../utils/AppError";

// GET /api/jurnal
export const getSemuaJurnal = asyncHandler(async (req: Request<{}, {}, {}, JurnalQuery>, res: Response) => {
    const { peserta, status } = req.query;
    let hasil = dataJurnal;

    if (peserta) hasil = hasil.filter(j => j.pesertaId === Number(peserta));
    if (status) hasil = hasil.filter(j => j.status === status);

    res.json({ sukses: true, total: hasil.length, data: hasil });
});

// GET /api/jurnal/:id
export const getJurnalById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const jurnal = dataJurnal.find(j => j.id === id);

    if (!jurnal) throw new NotFoundError("Jurnal");

    res.json({ sukses: true, data: jurnal });
});

// POST /api/jurnal
export const buatJurnal = asyncHandler(async (req: Request<{}, {}, JurnalBody>, res: Response) => {
    const { pesertaId, kegiatan, status } = req.body;

    const errors: string[] = [];
    if (!pesertaId) errors.push("PesertaId wajib diisi");
    if (!kegiatan || kegiatan.trim().length < 10) errors.push("Kegiatan minimal 10 karakter");
    if (errors.length > 0) throw new ValidationError(errors);

    const peserta = dataPeserta.find(p => p.id === pesertaId);
    if (!peserta) throw new NotFoundError("Peserta");

    const idBaru = dataJurnal.length > 0
        ? Math.max(...dataJurnal.map(j => j.id)) + 1
        : 1;

    const jurnalBaru: Jurnal = {
        id: idBaru,
        pesertaId,
        kegiatan,
        status: status || "belum",
        tanggal: new Date().toISOString().slice(0, 10)
    };

    dataJurnal.push(jurnalBaru);
    res.status(201).json({ sukses: true, data: jurnalBaru });
});

// PUT /api/jurnal/:id
export const updateJurnal = asyncHandler(async (req: Request<{ id: string }, {}, JurnalBody>, res: Response) => {
    const id = Number(req.params.id);
    const index = dataJurnal.findIndex(j => j.id === id);

    if (index === -1) throw new NotFoundError("Jurnal");

    const jurnalLama = dataJurnal[index];
    if (!jurnalLama) throw new NotFoundError("Jurnal");

    const { kegiatan, status } = req.body;

    if (kegiatan && kegiatan.trim().length < 10) {
        throw new ValidationError(["Kegiatan minimal 10 karakter"]);
    }

    dataJurnal[index] = {
        ...jurnalLama,
        kegiatan: kegiatan ?? jurnalLama.kegiatan,
        status: status ?? jurnalLama.status
    };

    res.json({ sukses: true, data: dataJurnal[index] });
});

// DELETE /api/jurnal/:id
export const hapusJurnal = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = dataJurnal.findIndex(j => j.id === id);

    if (index === -1) throw new NotFoundError("Jurnal");

    dataJurnal.splice(index, 1);
    res.status(204).send();
});