import { Test, TestingModule } from '@nestjs/testing';
import { ItinerariesService } from './itineraries.service';

describe('ItinerariesService', () => {
  let service: ItinerariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItinerariesService],
    }).compile();

    service = module.get<ItinerariesService>(ItinerariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
