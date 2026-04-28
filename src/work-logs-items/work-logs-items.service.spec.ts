import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogsItemsService } from './work-logs-items.service';

describe('WorkLogsItemsService', () => {
  let service: WorkLogsItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkLogsItemsService],
    }).compile();

    service = module.get<WorkLogsItemsService>(WorkLogsItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
