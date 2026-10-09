import { Request, Response } from "express";
import { jurnalService, SORT_JURNAL } from "../services/jurnal.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, suksesDenganMeta, dibuat } from "../utils/response";
import { parseListQuery, buatMeta } from "../utils/pagination";
import { JurnalBody, JurnalQuery } from "../types";

export const getSemuaJurnal = asyncHandler(async (req: Request, res: Response) => {
    const lq = parseListQuery(req.query, SORT_JURNAL);
    const pesertaId = req.query.pesertaId ? Number(req.query.pesertaId) : undefined;
    const statusReview = req.query.statusReview as "belum" | "sudah" | undefined;
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;

    const { data, total } = await jurnalService.daftarJurnal(lq, {
        pesertaId,
        statusReview,
        from,
        to,
    });
    suksesDenganMeta(res, data, buatMeta(lq.page, lq.limit, total));
});

export const getJurnalById = asyncHandler(async (req: Request, res: Response) => {
    const data = await jurnalService.ambilById(Number(req.params.id));
    sukses(res, data);
});

export const getJurnalSaya = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await jurnalService.ambilByPeserta(userId);
    suksesDenganTotal(res, data, "Jurnal milik saya");
});

export const buatJurnal = asyncHandler(async (req: Request<{}, {}, JurnalBody>, res: Response) => {
    const data = await jurnalService.buat(req.body);
    dibuat(res, data);
});

export const updateJurnal = asyncHandler(async (req: Request<{ id: string }, {}, JurnalBody>, res: Response) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const data = await jurnalService.update(Number(req.params.id), req.body, userId, userRole);
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