import { Test, TestingModule } from '@nestjs/testing';
import { OwnerRequestsService } from './owner-requests.service';
import { Repository } from 'typeorm';
import {
  OwnerRequest,
  OwnerRequestStatus,
} from './entities/owner_request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from '../user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('OwnerRequestsService', () => {
  let service: OwnerRequestsService;
  let repo: jest.Mocked<Repository<OwnerRequest>>;

  const mockRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerRequestsService,
        {
          provide: getRepositoryToken(OwnerRequest),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<OwnerRequestsService>(OwnerRequestsService);
    repo = module.get(getRepositoryToken(OwnerRequest));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // APPROVE

  describe('approveRequest', () => {
    it('should approve request and update user role', async () => {
      const mockRequest = {
        id: 1,
        status: OwnerRequestStatus.PENDING,
        user: {
          id: 1,
          role: UserRole.EMPLOYEE,
        },
      };

      repo.findOne.mockResolvedValue(mockRequest as any);

      (repo.manager.transaction as jest.Mock).mockImplementation(
        async (cb: any) => {
          const manager = {
            save: jest.fn(),
          };
          return cb(manager);
        },
      );

      const result = await service.approveRequest(1);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(result.status).toBe(OwnerRequestStatus.APPROVED);
      expect(result.user.role).toBe(UserRole.OWNER);
    });

    it('should throw "Request not found" if request does not exist', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.approveRequest(1)).rejects.toThrow(
        new BadRequestException('Request not found'),
      );
    });

    it('should throw if request already processed', async () => {
      const mockRequest = {
        id: 1,
        status: OwnerRequestStatus.APPROVED,
        user: {},
      };

      repo.findOne.mockResolvedValue(mockRequest as any);
      await expect(service.approveRequest(1)).rejects.toThrow(
        'Request already processed',
      );
    });
  });

  // REJECT
  describe('rejectRequest', () => {
    it('should reject request successfully', async () => {
      const mockRequest = {
        id: 1,
        status: OwnerRequestStatus.PENDING,
        user: {
          id: 1,
          role: UserRole.EMPLOYEE,
        },
      };
      repo.findOne.mockResolvedValue(mockRequest as any);
      repo.save.mockResolvedValue({
        ...mockRequest,
        status: OwnerRequestStatus.REJECTED,
      } as any);
      const result = await service.rejectRequest(1);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });

      expect(repo.save).toHaveBeenCalled();
      expect(result.status).toBe(OwnerRequestStatus.REJECTED);
      expect(result.user.role).toBe(UserRole.EMPLOYEE);
    });

    it('should throw if request not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.rejectRequest(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if request already processed', async () => {
      const mockeRequest = {
        id: 1,
        status: OwnerRequestStatus.APPROVED,
        user: {},
      };

      repo.findOne.mockResolvedValue(mockeRequest as any);
      await expect(service.rejectRequest(1)).rejects.toThrow(
        'Request already processed',
      );
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
