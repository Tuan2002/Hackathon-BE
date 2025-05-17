import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747243501364 implements MigrationInterface {
    name = 'Migration1747243501364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_b89e90c19762165e9647686650e" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_b89e90c19762165e9647686650e"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "category_id" character varying`);
    }

}
