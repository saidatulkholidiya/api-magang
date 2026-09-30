import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordAndRoleToPeserta1790733036589 implements MigrationInterface {
    name = 'AddPasswordAndRoleToPeserta1790733036589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "peserta" ADD "password" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "peserta" ADD "role" character varying NOT NULL DEFAULT 'peserta'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "peserta" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "peserta" DROP COLUMN "password"`);
    }

}
