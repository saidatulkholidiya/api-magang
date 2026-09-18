import dotenv from "dotenv";

dotenv.config();

function wajibAda(nama: string): string {
    const nilai = process.env[nama];
    if (!nilai) {
        throw new Error(`Environment variable ${nama} wajib diisi di file .env`);
    }
    return nilai;
}

function opsional(nama: string, bawaan: string): string {
    return process.env[nama] ?? bawaan;
}

export const config = {
    app: {
        name: opsional("APP_NAME", "API Magang"),
        port: Number(opsional("PORT", "3000")),
        env: opsional("NODE_ENV", "development"),
    },
    apiKey: wajibAda("API_KEY"),
} as const;