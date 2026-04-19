import { UserRole } from './../user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OwnerRequest,
  OwnerRequestStatus,
} from './entities/owner_request.entity';
import { CreateOwnerRequestDto } from './dto/create-owner-request.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OwnerRequestsService {
  constructor(
    @InjectRepository(OwnerRequest)
    private readonly ownerRequestRepo: Repository<OwnerRequest>,
  ) {}

  async createRequest(user: User, dto: CreateOwnerRequestDto) {
    if (user.role === 'owner') {
      throw new BadRequestException('You are already an owner');
    }

    const existed = await this.ownerRequestRepo.findOne({
      where: {
        user: { id: user.id },
        status: OwnerRequestStatus.PENDING,
      },
      relations: ['user'],
    });

    if (existed) {
      throw new BadRequestException('You already have a pending request');
    }

    const request = this.ownerRequestRepo.create({
      description: dto.description,
      user,
    });

    return this.ownerRequestRepo.save(request);
  }

  async findAll() {
    return this.ownerRequestRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveRequest(id: number) {
    const request = await this.ownerRequestRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!request) {
      throw new BadRequestException('Request not found');
    }

    if (request.status !== OwnerRequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    await this.ownerRequestRepo.manager.transaction(async (manager) => {
      request.status = OwnerRequestStatus.APPROVED;
      request.user.role = UserRole.OWNER;

      await manager.save(request.user);
      await manager.save(request);
    });

    // request.status = OwnerRequestStatus.APPROVED;

    // request.user.role = UserRole.OWNER;

    // await this.ownerRequestRepo.manager.save(request.user);
    // await this.ownerRequestRepo.save(request);

    return request;
  }

  // manager = EntityManager
  // Ưu điểm:
  // Có thể save bất kỳ entity nào
  // Không cần inject nhiều repository
  // await this.userRepository.save(request.user);
  // await this.ownerRequestRepo.save(request);

  async rejectRequest(id: number) {
    const request = await this.ownerRequestRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!request) {
      throw new BadRequestException('Request not found');
    }
    if (request.status !== OwnerRequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }
    request.status = OwnerRequestStatus.REJECTED;
    await this.ownerRequestRepo.save(request);
    return request;
  }
}
