import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747065058760 implements MigrationInterface {
    name = 'Migration1747065058760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dob"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "dob" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dob"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "dob" character varying`);
    }

}
