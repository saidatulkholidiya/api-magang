import { Request, Response } from "express";
import { pesertaRepository, jurnalRepository } from "../repositories";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses } from "../utils/response";

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const peserta = pesertaRepository.findAll();
    const jurnal = jurnalRepository.findAll();

    const belumReview = jurnal.filter(j => j.status === "belum").length;
    const rataRata = peserta.length > 0
        ? Number((jurnal.length / peserta.length).toFixed(2))
        : 0;

    sukses(res, {
        totalPeserta: peserta.length,
        totalJurnal: jurnal.length,
        jurnalBelumReview: belumReview,
        rataRataJurnalPerPeserta: rataRata
    });
});