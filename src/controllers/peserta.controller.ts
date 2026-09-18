import { Request, Response } from "express";
import { pesertaService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, dibuat } from "../utils/response";
import { PesertaBody, PesertaQuery } from "../types";

export const getSemuaPeserta = asyncHandler(async (req: Request<{}, {}, {}, PesertaQuery>, res: Response) => {
    const hasil = pesertaService.ambilSemua(req.query);
    suksesDenganTotal(res, hasil);
});

export const getPesertaById = asyncHandler(async (req: Request, res: Response) => {
    const peserta = pesertaService.ambilById(Number(req.params.id));
    sukses(res, peserta);
});

export const buatPeserta = asyncHandler(async (req: Request<{}, {}, PesertaBody>, res: Response) => {
    const peserta = pesertaService.buat(req.body);
    dibuat(res, peserta);
});

export const updatePeserta = asyncHandler(async (req: Request<{ id: string }, {}, PesertaBody>, res: Response) => {
    const peserta = pesertaService.update(Number(req.params.id), req.body);
    sukses(res, peserta, "Data berhasil diupdate");
});

export const hapusPeserta = asyncHandler(async (req: Request, res: Response) => {
    pesertaService.hapus(Number(req.params.id));
    res.status(204).send();
});

export const getJurnalPeserta = asyncHandler(async (req: Request, res: Response) => {
    const jurnal = pesertaService.ambilById(Number(req.params.id));
    const daftarJurnal = (await import("../services")).jurnalService.ambilByPeserta(Number(req.params.id));
    suksesDenganTotal(res, daftarJurnal, `Jurnal milik ${jurnal.nama}`);
});