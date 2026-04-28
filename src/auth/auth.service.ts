import { LoginUserDto } from './dto/login-user.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const existed = await this.userRepository.findOne({
      where: [
        { username: registerUserDto.username },
        { phone: registerUserDto.phone },
      ],
    });

    if (existed) {
      if (existed.username === registerUserDto.username) {
        throw new BadRequestException('Username already exists');
      }
      if (existed.phone === registerUserDto.phone) {
        throw new BadRequestException('Phone already exists');
      }
    }

    const hashedPassword = await this.hashPassword(registerUserDto.password);

    return await this.userRepository.save({
      ...registerUserDto,
      refresh_token: 'refresh_token',
      password: hashedPassword,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [
        loginUserDto.username && { username: loginUserDto.username },
        loginUserDto.phone && { phone: loginUserDto.phone },
      ].filter(Boolean),
    });
    if (!user) {
      throw new HttpException(
        'Username or phone number is not exist',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.is_verified) {
      throw new HttpException('Account is not verified', HttpStatus.FORBIDDEN);
    }

    if (!user.is_active) {
      throw new HttpException('Account has been disabled', HttpStatus.FORBIDDEN);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, username: user.username, role: user.role };

    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });
      const checkExistToken = await this.userRepository.findOneBy({
        username: verify.username,
        refresh_token,
      });
      if (checkExistToken) {
        return this.generateToken({ id: verify.id, username: verify.username });
      } else {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }

  private async generateToken(payload: { id: number; username: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET_KEY'),
      expiresIn: '1d',
    });

    // const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    await this.userRepository.update(
      { username: payload.username },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async sendOtp(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phone },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`otp:${phone}`, otp, 60);
    console.log(`OTP for ${phone}: ${otp}`);
    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyOtp(phone: string, otp: string) {
    const savedOtp = await this.redisService.get(`otp:${phone}`);
    if (!savedOtp) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    if (savedOtp !== otp) {
      throw new HttpException('OTP incorrect', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({
      where: { phone },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.is_verified = true;
    await this.userRepository.save(user);
    await this.redisService.del(`otp:${phone}`);
    return {
      message: 'Verify OTP successfully',
    };
  }
}
