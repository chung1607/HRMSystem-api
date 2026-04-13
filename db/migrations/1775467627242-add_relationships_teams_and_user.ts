import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipsTeamsAndUser1775467627242 implements MigrationInterface {
    name = 'AddRelationshipsTeamsAndUser1775467627242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teams\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`invite_code\` varchar(255) NULL, \`status\` enum ('pending', 'active', 'rejected') NOT NULL DEFAULT 'pending', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, UNIQUE INDEX \`IDX_8ad3974a1c9c97a4c2fcf36d95\` (\`invite_code\`), UNIQUE INDEX \`REL_5c5696b2c3c57698f890b2cbbd\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`teamsId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_60aced787bdeee9364c92353d0\` (\`teamsId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_60aced787bdeee9364c92353d0\` ON \`users\` (\`teamsId\`)`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD CONSTRAINT \`FK_5c5696b2c3c57698f890b2cbbdd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_60aced787bdeee9364c92353d02\` FOREIGN KEY (\`teamsId\`) REFERENCES \`teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_60aced787bdeee9364c92353d02\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP FOREIGN KEY \`FK_5c5696b2c3c57698f890b2cbbdd\``);
        await queryRunner.query(`DROP INDEX \`REL_60aced787bdeee9364c92353d0\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_60aced787bdeee9364c92353d0\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`teamsId\``);
        await queryRunner.query(`DROP INDEX \`REL_5c5696b2c3c57698f890b2cbbd\` ON \`teams\``);
        await queryRunner.query(`DROP INDEX \`IDX_8ad3974a1c9c97a4c2fcf36d95\` ON \`teams\``);
        await queryRunner.query(`DROP TABLE \`teams\``);
    }

}
