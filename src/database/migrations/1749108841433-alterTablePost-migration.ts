import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePostMigration1749108841433 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "USERNAME"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "USERNAME" TO "username"`)
    }

}
