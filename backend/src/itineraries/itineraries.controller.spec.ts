import { Test, TestingModule } from '@nestjs/testing';
import { Collection } from '@mikro-orm/core';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesService } from './itineraries.service';
import { Itinerary } from './itinerary.entity';
import { Location } from './location.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('ItinerariesController', () => {
  let itinerariesController: ItinerariesController;
  let itinerariesService: ItinerariesService;

  // Create a dummy user that satisfies the User entity requirements.
  const dummyUser = {
    uuid: 'user-uuid',
    email: 'test@example.com',
    password: 'secret',
  };

  // Mock implementation of the ItinerariesService
  const mockItinerariesService = {
    getAllItineraries: jest.fn(),
    getItineraryById: jest.fn(),
    createItinerary: jest.fn(),
    updateItinerary: jest.fn(),
    deleteItinerary: jest.fn(),
    createLocation: jest.fn(),
    updateLocation: jest.fn(),
    deleteLocation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItinerariesController],
      providers: [
        {
          provide: ItinerariesService,
          useValue: mockItinerariesService,
        },
      ],
    }).compile();

    itinerariesController = module.get<ItinerariesController>(ItinerariesController);
    itinerariesService = module.get<ItinerariesService>(ItinerariesService);
  });

  it('should be defined', () => {
    expect(itinerariesController).toBeDefined();
  });

  describe('getAllItineraries', () => {
    it('should return an array of itineraries with nested locations', async () => {
      const mockUser = dummyUser;
      const mockItineraries: Itinerary[] = [
        {
          uuid: '1',
          title: 'Itinerary 1',
          description: 'Description 1',
          user: mockUser,
          locations: new Collection<Location>(null as any, []),
        } as Itinerary,
        {
          uuid: '2',
          title: 'Itinerary 2',
          description: 'Description 2',
          user: mockUser,
          locations: new Collection<Location>(null as any, []),
        } as Itinerary,
      ];

      mockItinerariesService.getAllItineraries.mockResolvedValue(mockItineraries);
      const result = await itinerariesController.getAllItineraries(mockUser);
      expect(result).toEqual(mockItineraries);
      expect(mockItinerariesService.getAllItineraries).toHaveBeenCalledWith(mockUser.uuid);
    });
  });

  describe('getItinerary', () => {
    it('should return a specific itinerary with nested locations', async () => {
      const mockUser = dummyUser;
      const mockItinerary: Itinerary = {
        uuid: 'itinerary-uuid',
        title: 'Test Itinerary',
        description: 'Test description',
        user: mockUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;

      mockItinerariesService.getItineraryById.mockResolvedValue(mockItinerary);
      const result = await itinerariesController.getItinerary('itinerary-uuid', mockUser);
      expect(result).toEqual(mockItinerary);
      expect(mockItinerariesService.getItineraryById).toHaveBeenCalledWith('itinerary-uuid', mockUser.uuid);
    });

    it('should throw NotFoundException if itinerary does not exist', async () => {
      mockItinerariesService.getItineraryById.mockRejectedValue(new NotFoundException('Itinerary not found'));
      await expect(
          itinerariesController.getItinerary('non-existent-id', {
            uuid: dummyUser.uuid,
            email: dummyUser.email,
            password: dummyUser.password
          }),
      ).rejects.toThrow(NotFoundException);
      expect(mockItinerariesService.getItineraryById).toHaveBeenCalledWith('non-existent-id', dummyUser.uuid);
    });
  });

  describe('createItinerary', () => {
    it('should create a new itinerary', async () => {
      const mockUser = dummyUser;
      const dto: CreateItineraryDto = {
        title: 'New Itinerary',
        description: 'Test description',
      };
      const createdItinerary: Itinerary = {
        uuid: 'created-id',
        title: dto.title,
        description: dto.description,
        user: mockUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;

      mockItinerariesService.createItinerary.mockResolvedValue(createdItinerary);
      const result = await itinerariesController.createItinerary(dto, mockUser);
      expect(result).toEqual(createdItinerary);
      expect(mockItinerariesService.createItinerary).toHaveBeenCalledWith(dto, mockUser.uuid);
    });

    it('should throw NotFoundException if user not found', async () => {
      const mockUser = { uuid: 'invalid-user', email: '', password: '' };
      const dto: CreateItineraryDto = {
        title: 'Fails',
        description: 'Test description',
      };

      mockItinerariesService.createItinerary.mockRejectedValue(new NotFoundException('User not found'));
      await expect(itinerariesController.createItinerary(dto, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateItinerary', () => {
    it('should update an existing itinerary', async () => {
      const mockUser = dummyUser;
      const updateDto: UpdateItineraryDto = { title: 'Updated Title' };
      const updatedItinerary: Itinerary = {
        uuid: 'itinerary-uuid',
        title: 'Updated Title',
        description: 'Old Description',
        user: mockUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;

      mockItinerariesService.updateItinerary.mockResolvedValue(updatedItinerary);
      const result = await itinerariesController.updateItinerary('itinerary-uuid', updateDto, mockUser);
      expect(result).toEqual(updatedItinerary);
      expect(mockItinerariesService.updateItinerary).toHaveBeenCalledWith('itinerary-uuid', updateDto, mockUser.uuid);
    });

    it('should throw NotFoundException if itinerary does not exist', async () => {
      mockItinerariesService.updateItinerary.mockRejectedValue(new NotFoundException('Itinerary not found'));
      await expect(
          itinerariesController.updateItinerary('non-existent-id', {}, {
            uuid: dummyUser.uuid,
            email: dummyUser.email,
            password: dummyUser.password
          }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the user is not the owner', async () => {
      mockItinerariesService.updateItinerary.mockRejectedValue(new UnauthorizedException('Not allowed'));
      await expect(
          itinerariesController.updateItinerary('itinerary-uuid', {}, {
            uuid: 'wrong-user',
            email: 'wrong@example.com',
            password: 'wrong'
          }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteItinerary', () => {
    it('should delete an itinerary', async () => {
      const mockUser = dummyUser;
      mockItinerariesService.deleteItinerary.mockResolvedValue(undefined);
      await itinerariesController.deleteItinerary('itinerary-uuid', mockUser);
      expect(mockItinerariesService.deleteItinerary).toHaveBeenCalledWith('itinerary-uuid', mockUser.uuid);
    });

    it('should throw NotFoundException if itinerary does not exist', async () => {
      mockItinerariesService.deleteItinerary.mockRejectedValue(new NotFoundException('Itinerary not found'));
      await expect(
          itinerariesController.deleteItinerary('non-existent-id', {
            uuid: dummyUser.uuid,
            email: dummyUser.email,
            password: dummyUser.password
          }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // --- Tests for Location operations ---

  describe('createLocation', () => {
    it('should create a new location within an itinerary', async () => {
      const mockUser = dummyUser;
      const dto: CreateLocationDto = {
        photoURI: 'http://example.com/photo.jpg',
        title: 'New Location',
        description: 'Location description',
        formattedAddress: '123 Main St',
      };
      const createdLocation: Location = {
        uuid: 'loc-created',
        photoURI: dto.photoURI,
        title: dto.title,
        description: dto.description,
        formattedAddress: dto.formattedAddress,
      } as Location;

      mockItinerariesService.createLocation.mockResolvedValue(createdLocation);
      const result = await itinerariesController.createLocation('itinerary-uuid', dto, mockUser);
      expect(result).toEqual(createdLocation);
      expect(mockItinerariesService.createLocation).toHaveBeenCalledWith('itinerary-uuid', dto, mockUser.uuid);
    });
  });

  describe('updateLocation', () => {
    it('should update an existing location within an itinerary', async () => {
      const mockUser = dummyUser;
      const updateDto: UpdateLocationDto = { title: 'Updated Location Title' };
      const updatedLocation: Location = {
        uuid: 'loc-uuid',
        photoURI: 'http://example.com/photo.jpg',
        title: 'Updated Location Title',
        description: 'Old description',
        formattedAddress: '123 Main St',
      } as Location;

      mockItinerariesService.updateLocation.mockResolvedValue(updatedLocation);
      const result = await itinerariesController.updateLocation(
          'itinerary-uuid',
          'loc-uuid',
          updateDto,
          mockUser,
      );
      expect(result).toEqual(updatedLocation);
      expect(mockItinerariesService.updateLocation).toHaveBeenCalledWith('itinerary-uuid', 'loc-uuid', updateDto, mockUser.uuid);
    });

    it('should throw NotFoundException if location does not exist', async () => {
      mockItinerariesService.updateLocation.mockRejectedValue(new NotFoundException('Location not found'));
      await expect(
          itinerariesController.updateLocation('itinerary-uuid', 'non-existent-loc', {}, {
            uuid: dummyUser.uuid,
            email: dummyUser.email,
            password: dummyUser.password
          }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteLocation', () => {
    it('should delete a location from an itinerary', async () => {
      const mockUser = dummyUser;
      mockItinerariesService.deleteLocation.mockResolvedValue(undefined);
      await itinerariesController.deleteLocation('itinerary-uuid', 'loc-uuid', mockUser);
      expect(mockItinerariesService.deleteLocation).toHaveBeenCalledWith('itinerary-uuid', 'loc-uuid', mockUser.uuid);
    });

    it('should throw NotFoundException if location does not exist', async () => {
      mockItinerariesService.deleteLocation.mockRejectedValue(new NotFoundException('Location not found'));
      await expect(
          itinerariesController.deleteLocation('itinerary-uuid', 'non-existent-loc', {
            uuid: dummyUser.uuid,
            email: dummyUser.email,
            password: dummyUser.password
          }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
