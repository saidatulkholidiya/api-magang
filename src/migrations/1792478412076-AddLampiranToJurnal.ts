import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLampiranToJurnal1792478412076 implements MigrationInterface {
    name = 'AddLampiranToJurnal1792478412076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurnal_harian" ADD "lampiran" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurnal_harian" DROP COLUMN "lampiran"`);
    }

}
