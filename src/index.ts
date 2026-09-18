import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { requestLogger } from "./middlewares/logger.middleware";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import { tambahRequestId } from "./middlewares/requestId.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Middleware global
app.use(express.json());
app.use(requestLogger);
app.use(tambahRequestId);
app.use("/api", rateLimiter);

// 2. Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// 3. 404 handler — setelah semua route
app.use(notFoundHandler);

// 4. Error handler — PALING TERAKHIR
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});