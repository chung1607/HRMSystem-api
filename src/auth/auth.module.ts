import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register(
      {
        global: true,
        secret: 'jwt_secret_key',
        signOptions: { expiresIn: '1h' }
        
      }
    ),
    ConfigModule.forRoot(),
    RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
