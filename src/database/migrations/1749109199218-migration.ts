import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749109199218 implements MigrationInterface {
    name = 'Migration1749109199218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "USERNAME" TO "username"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "tilte" TO "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "title" TO "tilte"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "USERNAME"`);
    }

}
