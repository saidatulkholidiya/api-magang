import { Request, Response } from "express";
import { dataPeserta, dataJurnal } from "../data/dummy";
import { Peserta, PesertaBody, PesertaQuery } from "../types";

// GET /api/peserta
export const getSemuaPeserta = (req: Request<{}, {}, {}, PesertaQuery>, res: Response): void => {
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

    res.json({ total: hasil.length, data: hasil });
};

// GET /api/peserta/:id
export const getPesertaById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const peserta = dataPeserta.find(p => p.id === id);

    if (!peserta) {
        res.status(404).json({ error: `Peserta dengan id ${id} tidak ditemukan` });
        return;
    }

    res.json(peserta);
};

// POST /api/peserta
export const buatPeserta = (req: Request<{}, {}, PesertaBody>, res: Response): void => {
    const { nama, sekolah, fase } = req.body;

    if (!nama || !sekolah) {
        res.status(400).json({ error: "Nama dan sekolah wajib diisi" });
        return;
    }

    const idBaru = dataPeserta.length > 0
        ? Math.max(...dataPeserta.map(p => p.id)) + 1
        : 1;

    const pesertaBaru: Peserta = {
        id: idBaru,
        nama,
        sekolah,
        fase: fase || 1
    };

    dataPeserta.push(pesertaBaru);
    res.status(201).json(pesertaBaru);
};

// PUT /api/peserta/:id
export const updatePeserta = (req: Request<{ id: string }, {}, PesertaBody>, res: Response): void => {
    const id = Number(req.params.id);
    const index = dataPeserta.findIndex(p => p.id === id);

    if (index === -1) {
        res.status(404).json({ error: `Peserta dengan id ${id} tidak ditemukan` });
        return;
    }

    const pesertaLama = dataPeserta[index];
    if (!pesertaLama) {
        res.status(404).json({ error: `Peserta dengan id ${id} tidak ditemukan` });
        return;
    }

    const { nama, sekolah, fase } = req.body;
    dataPeserta[index] = {
        ...pesertaLama,
        nama: nama ?? pesertaLama.nama,
        sekolah: sekolah ?? pesertaLama.sekolah,
        fase: fase ?? pesertaLama.fase
    };

    res.json(dataPeserta[index]);
};

// DELETE /api/peserta/:id
export const hapusPeserta = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const index = dataPeserta.findIndex(p => p.id === id);

    if (index === -1) {
        res.status(404).json({ error: `Peserta dengan id ${id} tidak ditemukan` });
        return;
    }

    dataPeserta.splice(index, 1);
    res.status(204).send();
};

// GET /api/peserta/:id/jurnal
export const getJurnalPeserta = (req: Request, res: Response): void => {
    const pesertaId = Number(req.params.id);
    const peserta = dataPeserta.find(p => p.id === pesertaId);

    if (!peserta) {
        res.status(404).json({ error: `Peserta dengan id ${pesertaId} tidak ditemukan` });
        return;
    }

    const jurnal = dataJurnal.filter(j => j.pesertaId === pesertaId);
    res.json({ peserta: peserta.nama, total: jurnal.length, data: jurnal });
};