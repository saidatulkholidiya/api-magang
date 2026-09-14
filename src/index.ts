import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Data statis
interface Peserta {
    id: number;
    nama: string;
    sekolah: string;
}

const dataPeserta: Peserta[] = [
    { id: 1, nama: "Ajeng Nielza", sekolah: "SMK Negeri 6 Malang" },
    { id: 2, nama: "Saidatul Kholidiya", sekolah: "SMK Negeri 6 Malang" },
    { id: 3, nama: "Linda Angellina", sekolah: "SMK Negeri 5 Malang" },
    { id: 4, nama: "Zidan Alfa", sekolah: "SMK Negeri 5 Malang" }
];

// SOAL 2: GET /
app.get("/", (req: Request, res: Response) => {
    res.json({ pesan: "API Magang Batch 4" });
});

// SOAL 2: GET /health
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        waktu: new Date().toISOString(),
    });
});

// SOAL 2: GET /info
app.get("/info", (req: Request, res: Response) => {
    res.json({
        nama: process.env.APP_NAME || "API Magang",
        versi: process.env.APP_VERSION || "1.0.0",
        environment: process.env.NODE_ENV || "development",
    });
});

// SOAL 3: GET /peserta
app.get("/peserta", (req: Request, res: Response) => {
    res.json(dataPeserta);
});

// SOAL 3: GET /peserta/:id
app.get("/peserta/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const peserta = dataPeserta.find(p => p.id === id);
    
    if (!peserta) {
        res.status(404).json({ error: "Peserta tidak ditemukan" });
        return;
    }
    
    res.json(peserta);
});

// SOAL 4: POST /peserta
interface PesertaBody {
    nama: string;
    sekolah: string;
}

app.post("/peserta", (req: Request<{}, {}, PesertaBody>, res: Response) => {
    const { nama, sekolah } = req.body;
    
    if (!nama || !sekolah) {
        res.status(400).json({ error: "Nama dan sekolah wajib diisi" });
        return;
    }
    
    const idBaru = dataPeserta.length > 0 
        ? Math.max(...dataPeserta.map(p => p.id)) + 1 
        : 1;
    
    const pesertaBaru: Peserta = { id: idBaru, nama, sekolah };
    dataPeserta.push(pesertaBaru);
    
    res.status(201).json(pesertaBaru);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

// SOAL 5 — Perbandingan
// server-manual.ts : 130 baris total
// index.ts (Express): 118 baris total
// Selisih: 12 baris
// - Parsing body JSON: 31 baris → 1 baris (express.json())
// - Query string: 2 baris → req.query.sekolah
// - Gak perlu helper sendJSON sendiri