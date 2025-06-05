import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749143208528 implements MigrationInterface {
    name = 'Migration1749143208528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "ceo" character varying(15) NOT NULL, "email" character varying(40) NOT NULL, CONSTRAINT "UQ_b0fc567cf51b1cf717a9e8046a1" UNIQUE ("email"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "username" character varying(40) NOT NULL, "email" character varying(40) NOT NULL, "age" integer NOT NULL, "password" character varying NOT NULL, "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'u', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "body" text NOT NULL, "image" character varying(500) NOT NULL, "tags" character varying array NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_users_user" ("companyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_0d4bf59b58aff38908cabae569b" PRIMARY KEY ("companyId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f1e47d3e0eba4ccac82ffa9061" ON "company_users_user" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c9d284df04dbf84e9f14a0a6f" ON "company_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_users_user" ADD CONSTRAINT "FK_f1e47d3e0eba4ccac82ffa90613" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_users_user" ADD CONSTRAINT "FK_2c9d284df04dbf84e9f14a0a6f3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_users_user" DROP CONSTRAINT "FK_2c9d284df04dbf84e9f14a0a6f3"`);
        await queryRunner.query(`ALTER TABLE "company_users_user" DROP CONSTRAINT "FK_f1e47d3e0eba4ccac82ffa90613"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c9d284df04dbf84e9f14a0a6f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1e47d3e0eba4ccac82ffa9061"`);
        await queryRunner.query(`DROP TABLE "company_users_user"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
