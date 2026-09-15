export interface Peserta {
    id: number;
    nama: string;
    sekolah: string;
    fase: number;
}

export interface PesertaBody {
    nama: string;
    sekolah: string;
    fase?: number;
}

export interface PesertaQuery {
    sekolah?: string;
    fase?: string;
    limit?: string;
}