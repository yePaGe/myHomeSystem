import { Test, TestingModule } from '@nestjs/testing';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';

const mockHousesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('HousesController', () => {
  let controller: HousesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousesController],
      providers: [
        {
          provide: HousesService,
          useValue: mockHousesService,
        },
      ],
    }).compile();

    controller = module.get<HousesController>(HousesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
