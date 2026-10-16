import { Request, Response } from "express";
import { pesertaService, SORT_PESERTA } from "../services/peserta.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganTotal, suksesDenganMeta, dibuat } from "../utils/response";
import { parseListQuery, buatMeta } from "../utils/pagination";
import { PesertaBody, PesertaQuery } from "../types";
import { ForbiddenError } from "../utils/AppError";
import { ambilDto } from "../middlewares/validasi.middleware";
import { UpdateProfilDto } from "../dto/peserta.dto";

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


export const buatPeserta = asyncHandler(async (req, res) => {
    const data = await pesertaService.buat(req.body);
    
    res
        .status(201)
        .location(`/api/v1/peserta/${data.id}`)
        .json({
            sukses: true,
            pesan: "Peserta berhasil dibuat",
            data,
        });
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

export const patchPeserta = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const targetId = Number(req.params.id);

    if (userRole !== "mentor" && userId !== targetId) {
        throw new ForbiddenError("Kamu tidak berhak mengubah data peserta lain");
    }

    const data = ambilDto<UpdateProfilDto>(req);
    const hasil = await pesertaService.ubahProfil(targetId, data);
    sukses(res, hasil, "Data berhasil diupdate");
});

export const patchMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = ambilDto<UpdateProfilDto>(req);
    const hasil = await pesertaService.ubahProfil(userId, data);
    sukses(res, hasil, "Profil berhasil diupdate");
});