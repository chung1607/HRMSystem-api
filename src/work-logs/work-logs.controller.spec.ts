import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogsController } from './work-logs.controller';

describe('WorkLogsController', () => {
  let controller: WorkLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkLogsController],
    }).compile();

    controller = module.get<WorkLogsController>(WorkLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
