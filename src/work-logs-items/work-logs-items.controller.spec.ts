import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogsItemsController } from './work-logs-items.controller';

describe('WorkLogsItemsController', () => {
  let controller: WorkLogsItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkLogsItemsController],
    }).compile();

    controller = module.get<WorkLogsItemsController>(WorkLogsItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
