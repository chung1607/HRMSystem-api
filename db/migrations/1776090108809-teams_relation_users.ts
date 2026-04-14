import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamsRelationUsers1776090108809 implements MigrationInterface {
    name = 'TeamsRelationUsers1776090108809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teams\` DROP FOREIGN KEY \`FK_5c5696b2c3c57698f890b2cbbdd\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_60aced787bdeee9364c92353d02\``);
        await queryRunner.query(`DROP INDEX \`REL_5c5696b2c3c57698f890b2cbbd\` ON \`teams\``);
        await queryRunner.query(`DROP INDEX \`IDX_60aced787bdeee9364c92353d0\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_60aced787bdeee9364c92353d0\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`teamsId\``);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD \`owner_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD UNIQUE INDEX \`IDX_03655bd3d01df69022646faffd\` (\`owner_id\`)`);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_03655bd3d01df69022646faffd\` ON \`teams\` (\`owner_id\`)`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD CONSTRAINT \`FK_03655bd3d01df69022646faffd5\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teams\` DROP FOREIGN KEY \`FK_03655bd3d01df69022646faffd5\``);
        await queryRunner.query(`DROP INDEX \`REL_03655bd3d01df69022646faffd\` ON \`teams\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP INDEX \`IDX_03655bd3d01df69022646faffd\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP COLUMN \`owner_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`teamsId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD \`userId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_60aced787bdeee9364c92353d0\` ON \`users\` (\`teamsId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_60aced787bdeee9364c92353d0\` ON \`users\` (\`teamsId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_5c5696b2c3c57698f890b2cbbd\` ON \`teams\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_60aced787bdeee9364c92353d02\` FOREIGN KEY (\`teamsId\`) REFERENCES \`teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD CONSTRAINT \`FK_5c5696b2c3c57698f890b2cbbdd\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
