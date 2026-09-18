import express, { Application } from "express";
import routes from "./routes";
import { requestLogger } from "./middlewares/logger.middleware";
import { tambahRequestId } from "./middlewares/requestId.middleware";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

const app: Application = express();

app.use(express.json());
app.use(requestLogger);
app.use(tambahRequestId);
app.use("/api", rateLimiter);

app.use("/api", routes);

app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;