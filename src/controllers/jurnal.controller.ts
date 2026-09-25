import { Request, Response } from "express";
import { jurnalService } from "../services/jurnal.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, dibuat } from "../utils/response";
import { JurnalBody, JurnalQuery } from "../types";

export const getSemuaJurnal = asyncHandler(async (req: Request<{}, {}, {}, JurnalQuery>, res: Response) => {
    const { peserta, status } = req.query;
    const data = await jurnalService.ambilSemua(peserta, status);
    suksesDenganTotal(res, data);
});

export const getJurnalById = asyncHandler(async (req: Request, res: Response) => {
    const data = await jurnalService.ambilById(Number(req.params.id));
    sukses(res, data);
});

export const buatJurnal = asyncHandler(async (req: Request<{}, {}, JurnalBody>, res: Response) => {
    const data = await jurnalService.buat(req.body);
    dibuat(res, data);
});

export const updateJurnal = asyncHandler(async (req: Request<{ id: string }, {}, JurnalBody>, res: Response) => {
    const data = await jurnalService.update(Number(req.params.id), req.body);
    sukses(res, data, "Data berhasil diupdate");
});

export const reviewJurnal = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const status = req.body.status || "sudah";
    const data = await jurnalService.review(Number(req.params.id), status);
    sukses(res, data, "Status review berhasil diubah");
});

export const hapusJurnal = asyncHandler(async (req: Request, res: Response) => {
    await jurnalService.hapus(Number(req.params.id));
    res.status(204).send();
});