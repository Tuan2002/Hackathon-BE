import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747237122380 implements MigrationInterface {
    name = 'Migration1747237122380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_ffd9259fab5e31f5859053b7021"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_bec3c89789f76e330bbe1766b2c"`);
        await queryRunner.query(`CREATE TABLE "download_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "document_id" uuid NOT NULL, "download_user_id" uuid NOT NULL, "downloaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_92edb59037a50241ab2c1df76e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "download_user_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "downloaded_at"`);
        await queryRunner.query(`ALTER TABLE "download_documents" ADD CONSTRAINT "FK_e6d05740f136389b3f08b19fc6f" FOREIGN KEY ("download_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "download_documents" ADD CONSTRAINT "FK_f5803caa2514e2faf0c1ac306aa" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "download_documents" DROP CONSTRAINT "FK_f5803caa2514e2faf0c1ac306aa"`);
        await queryRunner.query(`ALTER TABLE "download_documents" DROP CONSTRAINT "FK_e6d05740f136389b3f08b19fc6f"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "downloaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "download_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "document_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "download_documents"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_bec3c89789f76e330bbe1766b2c" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_ffd9259fab5e31f5859053b7021" FOREIGN KEY ("download_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
