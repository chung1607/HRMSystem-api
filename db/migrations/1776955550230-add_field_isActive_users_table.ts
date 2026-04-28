import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldIsActiveUsersTable1776955550230 implements MigrationInterface {
    name = 'AddFieldIsActiveUsersTable1776955550230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_active\``);
    }

}
