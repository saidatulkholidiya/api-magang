import { IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class BuatJurnalDto {
    @IsInt({ message: "PesertaId harus berupa angka" })
    pesertaId!: number;

    @IsString({ message: "Kegiatan harus berupa teks" })
    @MinLength(10, { message: "Kegiatan minimal 10 karakter" })
    kegiatan!: string;

    @IsOptional()
    @IsString({ message: "Hambatan harus berupa teks" })
    hambatan?: string;

    @IsOptional()
    @IsString({ message: "Link commit harus berupa teks" })
    linkCommit?: string;
}