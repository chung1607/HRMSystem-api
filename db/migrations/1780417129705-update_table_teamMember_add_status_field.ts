import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableTeamMemberAddStatusField1780417129705 implements MigrationInterface {
    name = 'UpdateTableTeamMemberAddStatusField1780417129705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`team_members\` ADD \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`team_members\` DROP COLUMN \`status\``);
    }

}
