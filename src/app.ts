import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { requestLogger } from "./middlewares/logger.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { config } from "./config/env.config";
import { AppError } from "./utils/AppError";
import { ErrorCode } from "./utils/errorCodes";

const app: Application = express();

app.use(requestId);
app.use(helmet());
app.use(cors({
    origin: config.cors.origins,
    credentials: true,
}));

// express.json() — tangkap error DULU sebelum ke routes
const jsonParser = express.json({ limit: "1mb" });

app.use((req: Request, res: Response, next: NextFunction) => {
    jsonParser(req, res, (err: any) => {
        if (err) {
            if (
                err?.type === "entity.too.large" ||
                err?.name === "PayloadTooLargeError" ||
                err?.status === 413 ||
                err?.statusCode === 413
            ) {
                return next(new AppError("Ukuran request terlalu besar", 413, ErrorCode.PAYLOAD_TOO_LARGE));
            }
            if (err?.type === "entity.parse.failed") {
                return next(new AppError("Format JSON pada body tidak valid", 400, ErrorCode.INVALID_JSON));
            }
            return next(err);
        }
        next();
    });
});

app.use(requestLogger);
app.use("/api/v1", rateLimiter);
app.use("/api/v1", healthRoutes);
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;