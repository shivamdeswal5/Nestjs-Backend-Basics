import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUserMigration1749108910910 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "image" TO "IMG"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "IMG" TO "image"`)
    }
}
