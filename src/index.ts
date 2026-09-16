import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { requestLogger } from "./middlewares/logger.middleware";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import { tambahRequestId } from "./middlewares/requestId.middleware";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware global (urutan penting!)
app.use(express.json());
app.use(requestLogger);
app.use(tambahRequestId);
app.use("/api", rateLimiter);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});