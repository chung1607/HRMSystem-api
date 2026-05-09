import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TeamMembersModule } from './team_members/team_members.module';
import { TeamsModule } from './teams/teams.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { OwnerRequestsModule } from './owner-requests/owner-requests.module';
import { AdminModule } from './admin/admin.module';
import { WorkLogsModule } from './work-logs/work-logs.module';
import { PaymentsModule } from './payments/payments.module';
import { WorkLogsItemsModule } from './work-logs-items/work-logs-items.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PayrollModule } from './payroll/payroll.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    TeamMembersModule,
    TeamsModule,
    RedisModule,
    OwnerRequestsModule,
    AdminModule,
    WorkLogsModule,
    PaymentsModule,
    WorkLogsItemsModule,
    DashboardModule,
    PayrollModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
