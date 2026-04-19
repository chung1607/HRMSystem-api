import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'ConfigService',
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
        {
          provide: 'RedisService',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const dto = {
        username: 'abc',
        phone: '123',
        password: '123456',
      };
      mockUserRepository.findOne.mockResolvedValue(null);
      jest
        .spyOn(service as any, 'hashPassword')
        .mockResolvedValue('hashed_password');
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        ...dto,
        password: 'hashed_password',
        refresh_token: 'refresh_token',
      });
      const result = await service.register(dto as any);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: dto.username }, { phone: dto.phone }],
      });
      expect(service['hashPassword']).toHaveBeenCalledWith(dto.password);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...dto,
        password: 'hashed_password',
        refresh_token: 'refresh_token',
      });
      expect(result).toEqual({
        id: 1,
        ...dto,
        password: 'hashed_password',
        refresh_token: 'refresh_token',
      });
    });

    it('should throw if user exists', async () => {
      const dto = {
        username: 'abc',
        phone: '123',
        password: '123456',
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.register(dto as any)).rejects.toThrow(
        'User already exists',
      );

      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
