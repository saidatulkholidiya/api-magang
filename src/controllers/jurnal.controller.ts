import { Request, Response } from "express";
import { dataJurnal, dataPeserta } from "../data/dummy";
import { Jurnal, JurnalBody, JurnalQuery } from "../types";

// GET /api/jurnal
export const getSemuaJurnal = (req: Request<{}, {}, {}, JurnalQuery>, res: Response): void => {
    const { peserta, status } = req.query;
    let hasil = dataJurnal;

    if (peserta) {
        hasil = hasil.filter(j => j.pesertaId === Number(peserta));
    }

    if (status) {
        hasil = hasil.filter(j => j.status === status);
    }

    res.json({ total: hasil.length, data: hasil });
};

// GET /api/jurnal/:id
export const getJurnalById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const jurnal = dataJurnal.find(j => j.id === id);

    if (!jurnal) {
        res.status(404).json({ error: `Jurnal dengan id ${id} tidak ditemukan` });
        return;
    }

    res.json(jurnal);
};

// POST /api/jurnal
export const buatJurnal = (req: Request<{}, {}, JurnalBody>, res: Response): void => {
    const { pesertaId, kegiatan, status } = req.body;

    if (!pesertaId || !kegiatan) {
        res.status(400).json({ error: "PesertaId dan kegiatan wajib diisi" });
        return;
    }

    if (kegiatan.trim().length < 10) {
        res.status(400).json({ error: "Kegiatan minimal 10 karakter" });
        return;
    }

    const peserta = dataPeserta.find(p => p.id === pesertaId);
    if (!peserta) {
        res.status(400).json({ error: `Peserta dengan id ${pesertaId} tidak ditemukan` });
        return;
    }

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
    res.status(201).json(jurnalBaru);
};

// PUT /api/jurnal/:id
export const updateJurnal = (req: Request<{ id: string }, {}, JurnalBody>, res: Response): void => {
    const id = Number(req.params.id);
    const index = dataJurnal.findIndex(j => j.id === id);

    if (index === -1) {
        res.status(404).json({ error: `Jurnal dengan id ${id} tidak ditemukan` });
        return;
    }

    const jurnalLama = dataJurnal[index];
    if (!jurnalLama) {
        res.status(404).json({ error: `Jurnal dengan id ${id} tidak ditemukan` });
        return;
    }

    const { kegiatan, status } = req.body;

    if (kegiatan && kegiatan.trim().length < 10) {
        res.status(400).json({ error: "Kegiatan minimal 10 karakter" });
        return;
    }

    dataJurnal[index] = {
        ...jurnalLama,
        kegiatan: kegiatan ?? jurnalLama.kegiatan,
        status: status ?? jurnalLama.status
    };

    res.json(dataJurnal[index]);
};

// DELETE /api/jurnal/:id
export const hapusJurnal = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const index = dataJurnal.findIndex(j => j.id === id);

    if (index === -1) {
        res.status(404).json({ error: `Jurnal dengan id ${id} tidak ditemukan` });
        return;
    }

    dataJurnal.splice(index, 1);
    res.status(204).send();
};