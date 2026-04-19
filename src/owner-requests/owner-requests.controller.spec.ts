import { Test, TestingModule } from '@nestjs/testing';
import { OwnerRequestsController } from './owner-requests.controller';

describe('OwnerRequestsController', () => {
  let controller: OwnerRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerRequestsController],
    }).compile();

    controller = module.get<OwnerRequestsController>(OwnerRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
