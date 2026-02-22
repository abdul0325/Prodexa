import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperAnalyticsService } from './developer-analytics.service';

describe('DeveloperAnalyticsService', () => {
  let service: DeveloperAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeveloperAnalyticsService],
    }).compile();

    service = module.get<DeveloperAnalyticsService>(DeveloperAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
