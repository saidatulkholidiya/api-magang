import { hashPassword, cekPassword } from "./utils/password";
import { tanpaPassword } from "./utils/sanitize";

async function test() {
    console.log("=== Test Hash Password ===\n");

    // Hash password 
    const hash1 = await hashPassword("rahasia123");
    const hash2 = await hashPassword("rahasia123");
    const hash3 = await hashPassword("rahasia123");

    console.log("Hash 1:", hash1);
    console.log("Hash 2:", hash2);
    console.log("Hash 3:", hash3);
    console.log("\nBedakah hash 1, 2, 3?", hash1 !== hash2 && hash2 !== hash3);
    console.log("(Harus true — karena ada salt acak)\n");

    // Verifikasi
    console.log("=== Test Cek Password ===\n");
    const cocok = await cekPassword("rahasia123", hash1);
    console.log("Password 'rahasia123' cocok?", cocok);

    const salah = await cekPassword("salah", hash1);
    console.log("Password 'salah' cocok?", salah);

    // Test tanpaPassword
    console.log("\n=== Test tanpaPassword ===\n");
    const dataPeserta = {
        id: 1,
        nama: "Budi",
        email: "budi@example.com",
        password: hash1
    };

    const aman = tanpaPassword(dataPeserta);
    console.log("Sebelum:", dataPeserta);
    console.log("Sesudah:", aman);
    console.log("Ada password?", "password" in aman);
}

test().catch(console.error);