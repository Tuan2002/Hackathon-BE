import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747550612166 implements MigrationInterface {
    name = 'Migration1747550612166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "is_success" TO "status"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "status" TO "is_success"`);
    }

}
