import "reflect-metadata";
import { AppDataSource } from "./config/database.config";
import { getPesertaDenganJurnal, getJurnalDenganPeserta } from "./services/relasi.service";

async function test() {
    await AppDataSource.initialize();
    console.log("Database terhubung");

    // Test 1
    console.log("\n=== Peserta dengan Jurnal ===");
    const peserta = await getPesertaDenganJurnal(1);
    console.log(JSON.stringify(peserta, null, 2));

    // Test 2
    console.log("\n=== Jurnal dengan Peserta ===");
    const jurnal = await getJurnalDenganPeserta();
    console.log(JSON.stringify(jurnal, null, 2));

    await AppDataSource.destroy();
}

test().catch(console.error);