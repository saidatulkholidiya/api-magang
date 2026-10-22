import { Request, RequestHandler } from "express";
import { ClassConstructor } from "class-transformer";
import { ValidationError } from "../utils/AppError";
import { validasiDto, Sumber } from "../utils/validasi.util";

export function validasi<T extends object>(
    dto: ClassConstructor<T>,
    sumber: Sumber = "body"
): RequestHandler {
    return async (req, _res, next) => {
        try {
            let mentah: unknown;

            if (sumber === "query") {
                mentah = { ...req.query };
            } else if (sumber === "params") {
                mentah = { ...req.params };
            } else {
                mentah = req.body ?? {};
            }

            const instance = await validasiDto(dto, mentah, sumber);
            req.validated = { ...req.validated, [sumber]: instance };
            next();
        } catch (err) {
            next(err);
        }
    };
}

export function ambilDto<T>(req: Request, sumber: Sumber = "body"): T {
    return req.validated?.[sumber] as T;
}