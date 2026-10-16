import { Request, RequestHandler } from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationError } from "../utils/AppError";
import { ratakan } from "../utils/validasi.util";

type Sumber = "body" | "query" | "params";

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

            if (typeof mentah !== "object" || mentah === null || Array.isArray(mentah)) {
                throw new ValidationError([
                    { field: sumber, pesan: `${sumber} harus berupa objek` },
                ]);
            }

            const instance = plainToInstance(dto, mentah as Record<string, unknown>, {
                exposeDefaultValues: true,
                enableImplicitConversion: true,
                excludeExtraneousValues: false,
            });

            const errors = await validate(instance, {
                whitelist: true,
                forbidNonWhitelisted: sumber === "body",
                validationError: { target: false, value: false },
            });

            if (errors.length > 0) {
                throw new ValidationError(ratakan(errors));
            }

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