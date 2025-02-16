import { Test, TestingModule } from '@nestjs/testing';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

describe('MapsController', () => {
  let controller: MapsController;
  let service: MapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapsController],
      providers: [
        {
          provide: MapsService,
          useValue: {
            // Mock methods of MapsService here if needed
            someMethod: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MapsController>(MapsController);
    service = module.get<MapsService>(MapsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
