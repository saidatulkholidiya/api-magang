import { Request, Response } from "express";
import { pesertaService, SORT_PESERTA } from "../services/peserta.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, suksesDenganMeta, dibuat } from "../utils/response";
import { parseListQuery, buatMeta } from "../utils/pagination";
import { PesertaBody, PesertaQuery } from "../types";

export const getSemuaPeserta = asyncHandler(async (req: Request, res: Response) => {
    const lq = parseListQuery(req.query, SORT_PESERTA);
    const sekolah = typeof req.query.sekolah === "string" ? req.query.sekolah : undefined;
    const fase = req.query.fase ? Number(req.query.fase) : undefined;

    const { data, total } = await pesertaService.daftarPeserta(lq, { sekolah, fase });
    suksesDenganMeta(res, data, buatMeta(lq.page, lq.limit, total));
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

export const getProfilSaya = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await pesertaService.ambilById(userId);
    sukses(res, data);
});

export const getJurnalPeserta = asyncHandler(async (req: Request, res: Response) => {
    const data = await pesertaService.ambilById(Number(req.params.id));
    sukses(res, data.jurnalList ?? [], `Jurnal milik ${data.nama}`);
});