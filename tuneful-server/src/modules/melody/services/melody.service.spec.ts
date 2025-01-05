import { Test, TestingModule } from '@nestjs/testing';
import { MelodyService } from './melody.service';

describe('MelodyService', () => {
  let service: MelodyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MelodyService],
    }).compile();

    service = module.get<MelodyService>(MelodyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
