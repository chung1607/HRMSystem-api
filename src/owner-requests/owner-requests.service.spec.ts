import { Test, TestingModule } from '@nestjs/testing';
import { OwnerRequestsService } from './owner-requests.service';

describe('OwnerRequestsService', () => {
  let service: OwnerRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerRequestsService],
    }).compile();

    service = module.get<OwnerRequestsService>(OwnerRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
