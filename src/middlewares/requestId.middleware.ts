import { Request, Response, NextFunction } from "express";

export function tambahRequestId(req: Request, res: Response, next: NextFunction): void {
    req.requestId = Math.random().toString(36).substring(2, 10);
    res.setHeader("X-Request-Id", req.requestId);
    next();
}