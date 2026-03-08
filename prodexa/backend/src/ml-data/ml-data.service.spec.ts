import { Test, TestingModule } from '@nestjs/testing';
import { MlDataService } from './ml-data.service';

describe('MlDataService', () => {
  let service: MlDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MlDataService],
    }).compile();

    service = module.get<MlDataService>(MlDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
