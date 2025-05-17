import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747146955593 implements MigrationInterface {
    name = 'Migration1747146955593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "config" json NOT NULL, CONSTRAINT "PK_002b633ec0d45f5c6f928fea292" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "description" character varying, "image" character varying, "link" character varying, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "banners"`);
        await queryRunner.query(`DROP TABLE "configs"`);
    }

}
