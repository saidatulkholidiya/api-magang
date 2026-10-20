import { Expose } from "class-transformer";

export class JurnalResponseDto {
    @Expose() id!: number;
    @Expose() pesertaId!: number;
    @Expose() kegiatan!: string;
    @Expose() hambatan?: string;
    @Expose() linkCommit?: string;
    @Expose() statusReview!: string;
    @Expose() catatanMentor?: string;
    @Expose() lampiran?: { url: string; keterangan?: string }[];
    @Expose() createdAt!: Date;
}