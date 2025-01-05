import { Test, TestingModule } from '@nestjs/testing';
import { MelodyController } from './melody.controller';

describe('MelodyController', () => {
  let controller: MelodyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MelodyController],
    }).compile();

    controller = module.get<MelodyController>(MelodyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
