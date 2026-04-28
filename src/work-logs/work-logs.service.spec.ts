import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogsService } from './work-logs.service';

describe('WorkLogsService', () => {
  let service: WorkLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkLogsService],
    }).compile();

    service = module.get<WorkLogsService>(WorkLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
