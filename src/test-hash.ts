import { logger } from "./utils/logger";
import { hashPassword, cekPassword } from "./utils/password";
import { tanpaPassword } from "./utils/sanitize";

async function test() {
    logger.info("=== Test Hash Password ===\n");

    // Hash password 
    const hash1 = await hashPassword("rahasia123");
    const hash2 = await hashPassword("rahasia123");
    const hash3 = await hashPassword("rahasia123");

    logger.info("Hash 1:", { hash: hash1 });
    logger.info("Hash 2:", { hash: hash2 });
    logger.info("Hash 3:", { hash: hash3 });
    logger.info("\nBedakah hash 1, 2, 3?", { result: hash1 !== hash2 && hash2 !== hash3 });
    logger.info("(Harus true — karena ada salt acak)\n");

    // Verifikasi
    logger.info("=== Test Cek Password ===\n");
    const cocok = await cekPassword("rahasia123", hash1);
    logger.info("Password 'rahasia123' cocok?", { result: cocok });

    const salah = await cekPassword("salah", hash1);
    logger.info("Password 'salah' cocok?", { result: salah });

    // Test tanpaPassword
    logger.info("\n=== Test tanpaPassword ===\n");
    const dataPeserta = {
        id: 1,
        nama: "Budi",
        email: "budi@example.com",
        password: hash1
    };

    const aman = tanpaPassword(dataPeserta);
    logger.info("Sebelum:", { data: dataPeserta });
    logger.info("Sesudah:", { data: aman });
    logger.info("Ada password?", { result: "password" in aman });
}

test().catch(console.error);