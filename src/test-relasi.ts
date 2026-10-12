import "reflect-metadata";
import { AppDataSource } from "./config/database.config";
import { getPesertaDenganJurnal, getJurnalDenganPeserta } from "./services/relasi.service";
import { logger } from "./utils/logger";

async function test() {
    await AppDataSource.initialize();
    logger.info("Database terhubung");

    // Test 1
    logger.info("\n=== Peserta dengan Jurnal ===");
    const peserta = await getPesertaDenganJurnal(1);
    logger.info(JSON.stringify(peserta, null, 2));

    // Test 2
    logger.info("\n=== Jurnal dengan Peserta ===");
    const jurnal = await getJurnalDenganPeserta();
    logger.info(JSON.stringify(jurnal, null, 2));

    await AppDataSource.destroy();
}

test().catch(console.error);