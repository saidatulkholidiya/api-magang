import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { requestLogger } from "./middlewares/logger.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { config } from "./config/env.config";

const app: Application = express();

app.use(requestId);
app.use(helmet());
app.use(cors({
    origin: config.cors.origins,
    credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use("/api/v1", rateLimiter);
app.use("/api/v1", healthRoutes);
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;