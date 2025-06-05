import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigration1749097657258 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "USER_NAME" TO "username"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "USER_NAME"`)
    }

}
