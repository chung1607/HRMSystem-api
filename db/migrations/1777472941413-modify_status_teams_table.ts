import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyStatusTeamsTable1777472941413 implements MigrationInterface {
    name = 'ModifyStatusTeamsTable1777472941413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teams\` CHANGE \`status\` \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teams\` CHANGE \`status\` \`status\` enum ('pending', 'active', 'rejected') NOT NULL DEFAULT 'pending'`);
    }

}
