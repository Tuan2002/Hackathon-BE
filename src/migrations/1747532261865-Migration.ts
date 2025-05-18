import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747532261865 implements MigrationInterface {
    name = 'Migration1747532261865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "point_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "amount" integer NOT NULL, "point_action" character varying NOT NULL, "note" character varying, "history_user_id" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_e01b99df91c8b4e471723fbe8bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "transaction_hash" character varying NOT NULL, "amount" integer NOT NULL, "is_success" boolean NOT NULL DEFAULT false, "failed_reason" character varying, "payment_user_id" uuid NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "point" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "point" integer NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "point_histories" ADD CONSTRAINT "FK_7b8eab7471545d2133281fed4f2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_28b43b8be6786d5f1a2361b3c01" FOREIGN KEY ("payment_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_28b43b8be6786d5f1a2361b3c01"`);
        await queryRunner.query(`ALTER TABLE "point_histories" DROP CONSTRAINT "FK_7b8eab7471545d2133281fed4f2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "point"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "point"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "point_histories"`);
    }

}
