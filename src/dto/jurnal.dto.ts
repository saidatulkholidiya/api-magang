import {
    IsBoolean,
    IsDateString,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { ListQueryDto } from "./common.dto";
import { KeBoolean } from "./decorators/transform";

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

export const SORT_JURNAL = ["createdAt", "statusReview"] as const;

export class ListJurnalQueryDto extends ListQueryDto {
    @IsOptional()
    @IsIn(SORT_JURNAL)
    sortBy: (typeof SORT_JURNAL)[number] = "createdAt";

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pesertaId?: number;

    @IsOptional()
    @IsIn(["belum", "sudah"], { message: "statusReview harus belum atau sudah" })
    statusReview?: "belum" | "sudah";

    @IsOptional()
    @IsDateString({}, { message: "from harus berformat tanggal ISO, contoh 2026-09-01" })
    from?: string;

    @IsOptional()
    @IsDateString({}, { message: "to harus berformat tanggal ISO, contoh 2026-09-30" })
    to?: string;

    @IsOptional()
    @KeBoolean()
    @IsBoolean({ message: "belumDireview harus true atau false" })
    belumDireview?: boolean;
}