export interface Peserta {
    id: number;
    nama: string;
    sekolah: string;
    email: string;
    fase: number;
    status: "aktif" | "lulus" | "berhenti";
    telepon?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PesertaBody {
    nama: string;
    sekolah: string;
    email: string;        // ← TAMBAHIN INI
    fase?: number;
    telepon?: string;
}

export interface PesertaQuery {
    sekolah?: string;
    fase?: string;
    limit?: string;
}