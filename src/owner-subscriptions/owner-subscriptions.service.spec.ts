import { Test, TestingModule } from '@nestjs/testing';
import { OwnerSubscriptionsService } from './owner-subscriptions.service';

describe('OwnerSubscriptionsService', () => {
  let service: OwnerSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerSubscriptionsService],
    }).compile();

    service = module.get<OwnerSubscriptionsService>(OwnerSubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
