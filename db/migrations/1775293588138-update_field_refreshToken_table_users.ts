import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldRefreshTokenTableUsers1775293588138 implements MigrationInterface {
    name = 'UpdateFieldRefreshTokenTableUsers1775293588138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
