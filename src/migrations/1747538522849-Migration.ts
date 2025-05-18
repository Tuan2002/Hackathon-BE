import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747538522849 implements MigrationInterface {
    name = 'Migration1747538522849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_histories" DROP CONSTRAINT "FK_7b8eab7471545d2133281fed4f2"`);
        await queryRunner.query(`ALTER TABLE "point_histories" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "point_histories" DROP COLUMN "history_user_id"`);
        await queryRunner.query(`ALTER TABLE "point_histories" ADD "history_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "point_histories" ADD CONSTRAINT "FK_2d5dfb98e5327d0d0f9b63775ac" FOREIGN KEY ("history_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_histories" DROP CONSTRAINT "FK_2d5dfb98e5327d0d0f9b63775ac"`);
        await queryRunner.query(`ALTER TABLE "point_histories" DROP COLUMN "history_user_id"`);
        await queryRunner.query(`ALTER TABLE "point_histories" ADD "history_user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "point_histories" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "point_histories" ADD CONSTRAINT "FK_7b8eab7471545d2133281fed4f2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
