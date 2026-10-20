import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCatatanMentorToJurnal1792406102690 implements MigrationInterface {
    name = 'AddCatatanMentorToJurnal1792406102690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurnal_harian" ADD "catatanMentor" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurnal_harian" DROP COLUMN "catatanMentor"`);
    }

}
