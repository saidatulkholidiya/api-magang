import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RegisterDto } from "../dto/auth.dto";

const skenario = [
    {
        judul: "Payload Lengkap",
        body: { nama: "Dewi Sartika", sekolah: "SMK 5 Malang", email: "dewi@example.com", password: "rahasia123" },
    },
    {
        judul: "Nama Terlalu Pendek",
        body: { nama: "Bu", sekolah: "SMK 5 Malang", email: "budi@example.com", password: "rahasia123" },
    },
    {
        judul: "Email Salah Format",
        body: { nama: "Budi Santoso", sekolah: "SMK 5 Malang", email: "bukan-email", password: "rahasia123" },
    },
    {
        judul: "Password Tanpa Angka",
        body: { nama: "Budi Santoso", sekolah: "SMK 5 Malang", email: "budi@example.com", password: "rahasia" },
    },
    {
        judul: "Ada Field role (Iseng)",
        body: { nama: "Budi Santoso", sekolah: "SMK 5 Malang", email: "budi@example.com", password: "rahasia123", role: "mentor" },
    },
];

async function cekSemua(): Promise<void> {
    for (const item of skenario) {
        const dto = plainToInstance(RegisterDto, item.body);
        const error = await validate(dto);

        console.log(`\n${item.judul}`);

        if (error.length === 0) {
            console.log("   Lolos validasi");
            console.log("   Field yang dikenali:", Object.keys(dto).join(", "));
            continue;
        }

        error.forEach((e) => {
            const pesan = Object.values(e.constraints ?? {}).join(" | ");
            console.log(`   ${e.property}: ${pesan}`);
        });
    }
}

cekSemua();