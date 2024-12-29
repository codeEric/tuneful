import { Test, TestingModule } from '@nestjs/testing';
import { JwtconstantService } from './jwtConstant.service';

describe('JwtconstantService', () => {
  let service: JwtconstantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtconstantService],
    }).compile();

    service = module.get<JwtconstantService>(JwtconstantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
