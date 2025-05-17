import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747455118545 implements MigrationInterface {
    name = 'Migration1747455118545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_comments" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "document_comments" ADD "is_edited" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_comments" DROP COLUMN "is_edited"`);
        await queryRunner.query(`ALTER TABLE "document_comments" DROP COLUMN "image"`);
    }

}
