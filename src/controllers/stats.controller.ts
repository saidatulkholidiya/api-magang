import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sukses } from "../utils/response";
import { statsService } from "../services/stats.service";

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const data = await statsService.ambilStats();
    sukses(res, data);
});