import { Request, Response } from "express";
import { pesertaService } from "../services/peserta.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses, suksesDenganMeta } from "../utils/response";
import { buatMeta } from "../utils/pagination";
import { ForbiddenError } from "../utils/AppError";
import { ambilDto } from "../middlewares/validasi.middleware";
import { UpdateProfilDto, ListPesertaQueryDto } from "../dto/peserta.dto";
import { IdParamDto } from "../dto/common.dto";

export const getSemuaPeserta = asyncHandler(async (req: Request, res: Response) => {
    const query = ambilDto<ListPesertaQueryDto>(req, "query");

    const { data, total } = await pesertaService.daftarPeserta(query, {
        sekolah: query.sekolah,
        fase: query.fase,
    });

    suksesDenganMeta(res, data, buatMeta(query.page, query.limit, total));
});

export const getPesertaById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    const data = await pesertaService.ambilById(id);
    sukses(res, data);
});

export const buatPeserta = asyncHandler(async (req: Request, res: Response) => {
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

export const hapusPeserta = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    await pesertaService.hapus(id);
    res.status(204).send();
});

export const getProfilSaya = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await pesertaService.ambilById(userId);
    sukses(res, data);
});

export const getJurnalPeserta = asyncHandler(async (req: Request, res: Response) => {
    const { id } = ambilDto<IdParamDto>(req, "params");
    const data = await pesertaService.ambilById(id);
    sukses(res, data.jurnalList ?? [], `Jurnal milik ${data.nama}`);
});

export const patchPeserta = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { id: targetId } = ambilDto<IdParamDto>(req, "params");

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