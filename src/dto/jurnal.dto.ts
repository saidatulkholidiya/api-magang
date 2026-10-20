import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsDateString,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
    MinLength,
    ValidateIf,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ListQueryDto } from "./common.dto";
import { KeBoolean, Trim } from "./decorators/transform";

export class LampiranDto {
    @IsUrl({}, { message: "URL lampiran tidak valid" })
    url!: string;

    @IsOptional()
    @IsString({ message: "Keterangan lampiran harus berupa teks" })
    @MaxLength(200, { message: "Keterangan maksimal 200 karakter" })
    keterangan?: string;
}

export class CreateJurnalDto {
    @Trim()
    @IsString({ message: "Kegiatan harus berupa teks" })
    @MinLength(10, { message: "Kegiatan minimal 10 karakter" })
    kegiatan!: string;

    @IsOptional()
    @Trim()
    @IsString({ message: "Hambatan harus berupa teks" })
    @MaxLength(200, { message: "Hambatan maksimal 200 karakter" })
    hambatan?: string;

    @IsOptional()
    @IsUrl({}, { message: "Link commit harus berupa URL yang valid" })
    linkCommit?: string;

    @IsOptional()
    @IsArray({ message: "lampiran harus berupa array" })
    @ArrayMaxSize(5, { message: "Lampiran maksimal 5 item" })
    @ValidateNested({ each: true })
    @Type(() => LampiranDto)
    lampiran?: LampiranDto[];
}

export class UpdateJurnalDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    kegiatan?: string;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(2000)
    hambatan?: string;

    @IsOptional()
    @IsUrl({}, { message: "Link commit harus berupa URL yang valid" })
    linkCommit?: string;
}

export class ReviewJurnalDto {
    @IsIn(["belum", "sudah"], { message: "statusReview harus belum atau sudah" })
    statusReview!: "belum" | "sudah";

    @ValidateIf((o: ReviewJurnalDto) => o.statusReview === "sudah")
    @IsString({ message: "Catatan wajib diisi saat jurnal ditandai sudah direview" })
    @MinLength(5, { message: "Catatan minimal 5 karakter" })
    catatan?: string;
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