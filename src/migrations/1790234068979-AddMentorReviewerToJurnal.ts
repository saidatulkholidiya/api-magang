import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMentorReviewerToJurnal1790234068979 implements MigrationInterface {
    name = 'AddMentorReviewerToJurnal1790234068979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurnal_harian" ADD "reviewer_id" integer`);
        await queryRunner.query(`ALTER TABLE "jurnal_harian" ADD CONSTRAINT "FK_0cc121456e18e003f9ea738fe6a" FOREIGN KEY ("reviewer_id") REFERENCES "mentor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurnal_harian" DROP CONSTRAINT "FK_0cc121456e18e003f9ea738fe6a"`);
        await queryRunner.query(`ALTER TABLE "jurnal_harian" DROP COLUMN "reviewer_id"`);
    }

}
