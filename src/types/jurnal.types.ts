export interface Jurnal {
    id: number;
    pesertaId: number;
    kegiatan: string;
    status: "selesai" | "belum";
    tanggal: string;
}

export interface JurnalBody {
    pesertaId: number;
    kegiatan: string;
    status?: "selesai" | "belum";
}

export interface JurnalQuery {
    peserta?: string;
    status?: string;
}