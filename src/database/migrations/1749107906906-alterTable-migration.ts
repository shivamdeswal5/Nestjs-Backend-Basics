import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableMigration1749107906906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "USERNAME"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "USERNAME" TO "username"`)
    }

}