import { Test, TestingModule } from '@nestjs/testing';
import { OwnerSubscriptionsController } from './owner-subscriptions.controller';

describe('OwnerSubscriptionsController', () => {
  let controller: OwnerSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerSubscriptionsController],
    }).compile();

    controller = module.get<OwnerSubscriptionsController>(OwnerSubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
