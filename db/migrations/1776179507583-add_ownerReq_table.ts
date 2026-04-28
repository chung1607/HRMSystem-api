import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwnerReqTable1776179507583 implements MigrationInterface {
    name = 'AddOwnerReqTable1776179507583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`owner_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NULL, \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`owner_requests\` ADD CONSTRAINT \`FK_e45acc68efdf4694531caa2ce57\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`owner_requests\` DROP FOREIGN KEY \`FK_e45acc68efdf4694531caa2ce57\``);
        await queryRunner.query(`DROP TABLE \`owner_requests\``);
    }

}
