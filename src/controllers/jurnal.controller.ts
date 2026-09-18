import { Request, Response } from "express";
import { jurnalService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, dibuat } from "../utils/response";
import { JurnalBody, JurnalQuery } from "../types";

export const getSemuaJurnal = asyncHandler(async (req: Request<{}, {}, {}, JurnalQuery>, res: Response) => {
    const hasil = jurnalService.ambilSemua(req.query);
    suksesDenganTotal(res, hasil);
});

export const getJurnalById = asyncHandler(async (req: Request, res: Response) => {
    const jurnal = jurnalService.ambilById(Number(req.params.id));
    sukses(res, jurnal);
});

export const buatJurnal = asyncHandler(async (req: Request<{}, {}, JurnalBody>, res: Response) => {
    const jurnal = jurnalService.buat(req.body);
    dibuat(res, jurnal);
});

export const updateJurnal = asyncHandler(async (req: Request<{ id: string }, {}, JurnalBody>, res: Response) => {
    const jurnal = jurnalService.update(Number(req.params.id), req.body);
    sukses(res, jurnal, "Data berhasil diupdate");
});

export const reviewJurnal = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const status = req.body.status || "selesai";
    const jurnal = jurnalService.review(Number(req.params.id), status);
    sukses(res, jurnal, "Status review berhasil diubah");
});

export const hapusJurnal = asyncHandler(async (req: Request, res: Response) => {
    jurnalService.hapus(Number(req.params.id));
    res.status(204).send();
});