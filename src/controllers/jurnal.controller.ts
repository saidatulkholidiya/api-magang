import { Request, Response } from "express";
import { jurnalService } from "../services/jurnal.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, suksesDenganMeta, dibuat } from "../utils/response";
import { buatMeta } from "../utils/pagination";
import { ambilDto } from "../middlewares/validasi.middleware";
import { CreateJurnalDto, UpdateJurnalDto, ReviewJurnalDto, ListJurnalQueryDto } from "../dto/jurnal.dto";
import { IdParamDto } from "../dto/common.dto";
import { JurnalResponseDto } from "../dto/response/jurnal.response";
import { serialisasi } from "../utils/serialisasi";

export const getSemuaJurnal = asyncHandler(async (req: Request, res: Response) => {
    const query = ambilDto<ListJurnalQueryDto>(req, "query");

    const { data, total } = await jurnalService.daftarJurnal(query, {
        pesertaId: query.pesertaId,
        statusReview: query.statusReview,
        from: query.from,
        to: query.to,
    });
    suksesDenganMeta(res, data, buatMeta(query.page, query.limit, total));
});

export const getJurnalById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    const data = await jurnalService.ambilById(id);
    sukses(res, serialisasi(JurnalResponseDto, data));
});

export const getJurnalSaya = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await jurnalService.ambilByPeserta(userId);
    suksesDenganTotal(res, serialisasi(JurnalResponseDto, data), "Jurnal milik saya");
});

export const buatJurnal = asyncHandler(async (req: Request, res: Response) => {
    const data = ambilDto<CreateJurnalDto>(req);
    const userId = req.user!.id;

    const hasil = await jurnalService.buat({
        ...data,
        pesertaId: userId,
    });
    dibuat(res, hasil);
});

export const updateJurnal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    const data = ambilDto<UpdateJurnalDto>(req);
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const hasil = await jurnalService.update(id, data, userId, userRole);
    sukses(res, hasil, "Data berhasil diupdate");
});

export const reviewJurnal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    const data = ambilDto<ReviewJurnalDto>(req);

    const hasil = await jurnalService.review(id, data.statusReview, data.catatan);
    sukses(res, hasil, "Status review berhasil diubah");
});

export const hapusJurnal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    await jurnalService.hapus(id);
    res.status(204).send();
});