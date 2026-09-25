import { Peserta } from "../types/peserta.types";

export const dataPeserta: Peserta[] = [
    {
        id: 1,
        nama: "Linda Angellina",
        sekolah: "SMK Negeri 5 Malang",
        email: "linda@example.com",
        fase: 1,
        status: "aktif",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        nama: "Zidan Alfa Permana",
        sekolah: "SMK Negeri 5 Malang",
        email: "zidan@example.com",
        fase: 1,
        status: "aktif",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        nama: "Ajeng Nielza",
        sekolah: "SMK Negeri 6 Malang",
        email: "ajeng@example.com",
        fase: 2,
        status: "aktif",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        nama: "Saidatul Kholidiya",
        sekolah: "SMK Negeri 6 Malang",
        email: "dodi@example.com",
        fase: 2,
        status: "aktif",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const dataJurnal: any[] = [
    {
        id: 1,
        pesertaId: 1,
        kegiatan: "Belajar Express",
        status: "selesai",
        statusReview: "sudah",
        tanggal: "2026-09-14"
    },
    {
        id: 2,
        pesertaId: 1,
        kegiatan: "Belajar Routing",
        status: "belum",
        statusReview: "belum",
        tanggal: "2026-09-15"
    },
    {
        id: 3,
        pesertaId: 2,
        kegiatan: "Belajar Middleware",
        status: "belum",
        statusReview: "belum",
        tanggal: "2026-09-15"
    }
];