import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperAnalyticsController } from './developer-analytics.controller';

describe('DeveloperAnalyticsController', () => {
  let controller: DeveloperAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeveloperAnalyticsController],
    }).compile();

    controller = module.get<DeveloperAnalyticsController>(DeveloperAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
