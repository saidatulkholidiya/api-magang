import { JwtPayload } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            requestId?: string;
            validated?: {
                body?: unknown;
                query?: unknown;
                params?: unknown;
            };
        }
    }
}

export {};