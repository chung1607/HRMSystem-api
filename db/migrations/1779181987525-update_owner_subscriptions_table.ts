import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOwnerSubscriptionsTable1779181987525 implements MigrationInterface {
    name = 'UpdateOwnerSubscriptionsTable1779181987525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`owner_subscriptions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`month\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`proof_image\` varchar(255) NOT NULL, \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`admin_note\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ownerId\` int NULL, \`teamId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`owner_subscriptions\` ADD CONSTRAINT \`FK_9cf4b0bfd5f8231c897d3cd8e88\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`owner_subscriptions\` ADD CONSTRAINT \`FK_e6794264aa05904f3d04ad541f4\` FOREIGN KEY (\`teamId\`) REFERENCES \`teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`owner_subscriptions\` DROP FOREIGN KEY \`FK_e6794264aa05904f3d04ad541f4\``);
        await queryRunner.query(`ALTER TABLE \`owner_subscriptions\` DROP FOREIGN KEY \`FK_9cf4b0bfd5f8231c897d3cd8e88\``);
        await queryRunner.query(`DROP TABLE \`owner_subscriptions\``);
    }

}
