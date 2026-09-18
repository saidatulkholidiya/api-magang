import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(
    fn: (req: any, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}