import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldAvatarTableUsers1775379445620 implements MigrationInterface {
    name = 'UpdateFieldAvatarTableUsers1775379445620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar\``);
    }

}
