import { Router } from "express";
import pesertaRoutes from "./peserta.routes";
import jurnalRoutes from "./jurnal.routes";
import statsRoutes from "./stats.routes";
import testRoutes from "./test.routes";

const router = Router();

router.use("/peserta", pesertaRoutes);
router.use("/jurnal", jurnalRoutes);
router.use("/stats", statsRoutes);
router.use("/test", testRoutes);

export default router;