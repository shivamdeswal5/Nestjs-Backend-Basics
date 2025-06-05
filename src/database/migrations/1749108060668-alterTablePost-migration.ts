import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePostMigration1749108060668 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "title" TO "Title"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "Title" TO "tilte"`)
    }

}
