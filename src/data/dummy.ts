import { Peserta, Jurnal } from "../types";

export const dataPeserta: Peserta[] = [
    { id: 1, nama: "Linda", sekolah: "SMK Negeri 5 Malang", fase: 1 },
    { id: 2, nama: "Zidan", sekolah: "SMK Negeri 5 Malang", fase: 1 },
    { id: 3, nama: "Ajeng", sekolah: "SMK Negeri 6 Malang", fase: 2 },
    { id: 4, nama: "Saida", sekolah: "SMK Negeri 6 Malang", fase: 2 }
];

export const dataJurnal: Jurnal[] = [
    { id: 1, pesertaId: 1, kegiatan: "Belajar Express", status: "selesai", tanggal: "2026-09-14" },
    { id: 2, pesertaId: 1, kegiatan: "Belajar Routing", status: "belum", tanggal: "2026-09-15" },
    { id: 3, pesertaId: 2, kegiatan: "Belajar Middleware", status: "belum", tanggal: "2026-09-15" }
];