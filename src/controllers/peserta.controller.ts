import { Request, Response } from "express";
import { pesertaService } from "../services/peserta.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, dibuat } from "../utils/response";
import { PesertaBody, PesertaQuery } from "../types";

export const getSemuaPeserta = asyncHandler(async (req: Request<{}, {}, {}, PesertaQuery>, res: Response) => {
    const { sekolah, fase, limit } = req.query;
    const data = await pesertaService.ambilSemua(sekolah, fase, limit);
    suksesDenganTotal(res, data);
});

export const getPesertaById = asyncHandler(async (req: Request, res: Response) => {
    const data = await pesertaService.ambilById(Number(req.params.id));
    sukses(res, data);
});

export const buatPeserta = asyncHandler(async (req: Request<{}, {}, PesertaBody>, res: Response) => {
    const data = await pesertaService.buat(req.body);
    dibuat(res, data);
});

export const updatePeserta = asyncHandler(async (req: Request<{ id: string }, {}, PesertaBody>, res: Response) => {
    const data = await pesertaService.update(Number(req.params.id), req.body);
    sukses(res, data, "Data berhasil diupdate");
});

export const hapusPeserta = asyncHandler(async (req: Request, res: Response) => {
    await pesertaService.hapus(Number(req.params.id));
    res.status(204).send();
});

export const getJurnalPeserta = asyncHandler(async (req: Request, res: Response) => {
    const data = await pesertaService.ambilById(Number(req.params.id));
    sukses(res, data.jurnalList ?? [], `Jurnal milik ${data.nama}`);
});