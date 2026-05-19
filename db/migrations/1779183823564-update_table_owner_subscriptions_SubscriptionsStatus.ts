import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableOwnerSubscriptionsSubscriptionsStatus1779183823564 implements MigrationInterface {
    name = 'UpdateTableOwnerSubscriptionsSubscriptionsStatus1779183823564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`owner_subscriptions\` CHANGE \`proof_image\` \`proof_image\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`owner_subscriptions\` CHANGE \`proof_image\` \`proof_image\` varchar(255) NOT NULL`);
    }

}
