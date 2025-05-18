import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747540640336 implements MigrationInterface {
    name = 'Migration1747540640336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_histories" ADD "last_point" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_histories" DROP COLUMN "last_point"`);
    }

}
