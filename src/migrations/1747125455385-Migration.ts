import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747125455385 implements MigrationInterface {
    name = 'Migration1747125455385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

}
