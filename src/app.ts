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

// Import Swagger
import swaggerUi from "swagger-ui-express";
import { spec } from "./docs/swagger";

const app: Application = express();

app.use(requestId);

// 1. DAFTARKAN SWAGGER PALING AWAL (SETELAH REQUEST ID)
    app.get("/api/docs.json", (_req: Request, res: Response) => {
        res.json(spec);
    });

    app.use(
        "/api/docs",
        helmet({ contentSecurityPolicy: false }),
        swaggerUi.serve,
        swaggerUi.setup(spec, {
            customSiteTitle: "API Magang Batch 4 — Dokumentasi",
            swaggerOptions: { persistAuthorization: true, docExpansion: "list" },
        })
    );


// 2. MIDDLEWARE GLOBAL
app.use(helmet());
app.use(cors({
    origin: config.cors.origins,
    credentials: true,
}));

const jsonParser = express.json({ limit: "1mb" });
app.use((req: Request, res: Response, next: NextFunction) => {
    jsonParser(req, res, (err: any) => {
        if (err) {
            if (err?.type === "entity.too.large" || err?.name === "PayloadTooLargeError" || err?.status === 413 || err?.statusCode === 413) {
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

// 3. RUTE APLIKASI
app.use("/api/v1", healthRoutes);
app.use("/api/v1", routes);

// 4. HANDLER ERROR (PALING BAWAH)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;