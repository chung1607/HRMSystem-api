import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkLogsPaymentsWorkLogsItemsTable1777388893446 implements MigrationInterface {
    name = 'UpdateWorkLogsPaymentsWorkLogsItemsTable1777388893446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`work_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`work_date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`teamMemberId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`work_log_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cane_type\` enum ('fresh', 'burnt') NOT NULL, \`quantity\` int NOT NULL, \`price_per_unit\` decimal(10,2) NOT NULL, \`total_amount\` decimal(12,2) NOT NULL, \`workLogId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(12,2) NOT NULL, \`payment_date\` date NOT NULL, \`note\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`team_member_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`work_logs\` ADD CONSTRAINT \`FK_124a700f39689d42cae78301fff\` FOREIGN KEY (\`teamMemberId\`) REFERENCES \`team_members\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`work_log_items\` ADD CONSTRAINT \`FK_b76633c72963250c8d91edf9707\` FOREIGN KEY (\`workLogId\`) REFERENCES \`work_logs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_73e81e6a08b2e558a37acf1eb79\` FOREIGN KEY (\`team_member_id\`) REFERENCES \`team_members\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_73e81e6a08b2e558a37acf1eb79\``);
        await queryRunner.query(`ALTER TABLE \`work_log_items\` DROP FOREIGN KEY \`FK_b76633c72963250c8d91edf9707\``);
        await queryRunner.query(`ALTER TABLE \`work_logs\` DROP FOREIGN KEY \`FK_124a700f39689d42cae78301fff\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`work_log_items\``);
        await queryRunner.query(`DROP TABLE \`work_logs\``);
    }

}
