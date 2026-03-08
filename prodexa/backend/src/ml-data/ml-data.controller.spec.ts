import { Test, TestingModule } from '@nestjs/testing';
import { MlDataController } from './ml-data.controller';

describe('MlDataController', () => {
  let controller: MlDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MlDataController],
    }).compile();

    controller = module.get<MlDataController>(MlDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
