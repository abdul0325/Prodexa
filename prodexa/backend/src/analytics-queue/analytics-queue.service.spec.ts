import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsQueueService } from './analytics-queue.service';

describe('AnalyticsQueueService', () => {
  let service: AnalyticsQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsQueueService],
    }).compile();

    service = module.get<AnalyticsQueueService>(AnalyticsQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
