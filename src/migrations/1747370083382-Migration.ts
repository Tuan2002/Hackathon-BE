import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747370083382 implements MigrationInterface {
    name = 'Migration1747370083382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "rejected_reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "rejected_reason"`);
    }

}
