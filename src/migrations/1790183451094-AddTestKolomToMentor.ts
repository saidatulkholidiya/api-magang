import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTestKolomToMentor1790183451094 implements MigrationInterface {
    name = 'AddTestKolomToMentor1790183451094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" ADD "testKolom" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "testKolom"`);
    }

}
