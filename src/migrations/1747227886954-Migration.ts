import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747227886954 implements MigrationInterface {
    name = 'Migration1747227886954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "document_id" uuid NOT NULL, "download_user_id" uuid NOT NULL, "downloaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "document_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_767ab7d42d379ae7c20952091e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "parent_id" uuid, "document_id" uuid NOT NULL, "commenter_id" uuid NOT NULL, "content" text NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "dislike_count" integer NOT NULL DEFAULT '0', "reply_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_200479d42efeede25a2355d7708" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "download_user_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "downloaded_at"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "document_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "download_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "downloaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "UQ_06f1e6b2d31b55696c2899a64d4" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "owner_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "author_id" uuid`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "publisher_id" uuid`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "category_id" character varying`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "short_description" character varying`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "view_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "download_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "file_key" character varying`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "file_name" character varying`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "file_type" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_06f1e6b2d31b55696c2899a64d" ON "documents" ("slug") `);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_ffd9259fab5e31f5859053b7021" FOREIGN KEY ("download_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_bec3c89789f76e330bbe1766b2c" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_documents" ADD CONSTRAINT "FK_0a09dcd10b8ca91a38e736cf675" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_documents" ADD CONSTRAINT "FK_2fde9f8fc6f16547d8b597bc34d" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_888a4852e27627d1ebd8a094e98" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_85d4e65f38815d121b87e9ed7aa" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_713c6604ff46d15b0c018373e04" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_comments" ADD CONSTRAINT "FK_8515d54fcc9f9f925d9abb0425a" FOREIGN KEY ("commenter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_comments" ADD CONSTRAINT "FK_cc25441dacae9903dfb4bd9d15c" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_comments" ADD CONSTRAINT "FK_33532225bce025fa2b2b93ad068" FOREIGN KEY ("parent_id") REFERENCES "document_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_comments" DROP CONSTRAINT "FK_33532225bce025fa2b2b93ad068"`);
        await queryRunner.query(`ALTER TABLE "document_comments" DROP CONSTRAINT "FK_cc25441dacae9903dfb4bd9d15c"`);
        await queryRunner.query(`ALTER TABLE "document_comments" DROP CONSTRAINT "FK_8515d54fcc9f9f925d9abb0425a"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_713c6604ff46d15b0c018373e04"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_85d4e65f38815d121b87e9ed7aa"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_888a4852e27627d1ebd8a094e98"`);
        await queryRunner.query(`ALTER TABLE "favorite_documents" DROP CONSTRAINT "FK_2fde9f8fc6f16547d8b597bc34d"`);
        await queryRunner.query(`ALTER TABLE "favorite_documents" DROP CONSTRAINT "FK_0a09dcd10b8ca91a38e736cf675"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_bec3c89789f76e330bbe1766b2c"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_ffd9259fab5e31f5859053b7021"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06f1e6b2d31b55696c2899a64d"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "file_type"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "file_key"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "download_count"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "view_count"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "short_description"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "publisher_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "author_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "UQ_06f1e6b2d31b55696c2899a64d4"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "downloaded_at"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "download_user_id"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "downloaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "download_user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "document_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "document_comments"`);
        await queryRunner.query(`DROP TABLE "favorite_documents"`);
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
