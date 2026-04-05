import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesTeamsAndTeamMembersUpdateRelationships1775400158951 implements MigrationInterface {
    name = 'AddTablesTeamsAndTeamMembersUpdateRelationships1775400158951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teams\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`invite_code\` varchar(255) NULL, \`status\` enum ('pending', 'active', 'rejected') NOT NULL DEFAULT 'pending', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`owner_id\` int NULL, UNIQUE INDEX \`IDX_8ad3974a1c9c97a4c2fcf36d95\` (\`invite_code\`), UNIQUE INDEX \`REL_03655bd3d01df69022646faffd\` (\`owner_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`team_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`joined_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`team_id\` int NULL, \`user_id\` int NULL, UNIQUE INDEX \`IDX_c2bf4967c8c2a6b845dadfbf3d\` (\`user_id\`), UNIQUE INDEX \`REL_c2bf4967c8c2a6b845dadfbf3d\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD CONSTRAINT \`FK_03655bd3d01df69022646faffd5\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_members\` ADD CONSTRAINT \`FK_fdad7d5768277e60c40e01cdcea\` FOREIGN KEY (\`team_id\`) REFERENCES \`teams\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_members\` ADD CONSTRAINT \`FK_c2bf4967c8c2a6b845dadfbf3d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`team_members\` DROP FOREIGN KEY \`FK_c2bf4967c8c2a6b845dadfbf3d4\``);
        await queryRunner.query(`ALTER TABLE \`team_members\` DROP FOREIGN KEY \`FK_fdad7d5768277e60c40e01cdcea\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP FOREIGN KEY \`FK_03655bd3d01df69022646faffd5\``);
        await queryRunner.query(`DROP INDEX \`REL_c2bf4967c8c2a6b845dadfbf3d\` ON \`team_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_c2bf4967c8c2a6b845dadfbf3d\` ON \`team_members\``);
        await queryRunner.query(`DROP TABLE \`team_members\``);
        await queryRunner.query(`DROP INDEX \`REL_03655bd3d01df69022646faffd\` ON \`teams\``);
        await queryRunner.query(`DROP INDEX \`IDX_8ad3974a1c9c97a4c2fcf36d95\` ON \`teams\``);
        await queryRunner.query(`DROP TABLE \`teams\``);
    }

}
