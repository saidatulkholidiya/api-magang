import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSkillManyToMany1790228351332 implements MigrationInterface {
    name = 'AddSkillManyToMany1790228351332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tabel "skill" dan "peserta_skill" sudah dibuat oleh
        // AddRelasiPesertaJurnal1790224424611 (migration sebelumnya).
        // Migration ini hanya membersihkan kolom test dari tabel mentor.
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "testKolom"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" ADD "testKolom" character varying`);
    }
}