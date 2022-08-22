import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsController } from '../../src/predictions/predictions.controller';
import { PredictionsService } from '../../src/predictions/predictions.service';

describe('PredictionsController', () => {
  let controller: PredictionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionsController],
      providers: [PredictionsService],
    }).compile();

    controller = module.get<PredictionsController>(PredictionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
