import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { Itinerary } from './itinerary.entity';
import { Location } from './location.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from '../users/user.entity';
import { Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';

describe('ItinerariesService', () => {
  let itinerariesService: ItinerariesService;
  let entityManager: EntityManager;

  // Dummy user object that meets the User type requirements.
  const dummyUser: User = {
    uuid: 'user-uuid',
    email: 'test@example.com',
    password: 'secret',
    // any additional fields if needed...
  };

  beforeEach(async () => {
    const mockEm = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      assign: jest.fn(),
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
      populate: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItinerariesService,
        {
          provide: EntityManager,
          useValue: mockEm,
        },
      ],
    }).compile();

    itinerariesService = module.get<ItinerariesService>(ItinerariesService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(itinerariesService).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // getAllItineraries
  // ---------------------------------------------------------------------------
  describe('getAllItineraries', () => {
    it('should return an array of itineraries with populated locations', async () => {
      const userUuid = dummyUser.uuid;
      const mockItineraries: Itinerary[] = [
        {
          uuid: '1',
          title: 'Itinerary 1',
          description: 'Description 1',
          user: dummyUser,
          locations: new Collection<Location>(null as any, []),
        } as Itinerary,
        {
          uuid: '2',
          title: 'Itinerary 2',
          description: 'Description 2',
          user: dummyUser,
          locations: new Collection<Location>(null as any, []),
        } as Itinerary,
      ];
      (entityManager.find as jest.Mock).mockResolvedValue(mockItineraries);

      const result = await itinerariesService.getAllItineraries(userUuid);

      expect(entityManager.find).toHaveBeenCalledWith(Itinerary, { user: { uuid: userUuid } });
      // Verify that populate was called for each itinerary
      mockItineraries.forEach((itinerary) => {
        expect(entityManager.populate).toHaveBeenCalledWith(itinerary, ['locations']);
      });
      expect(result).toEqual(mockItineraries);
    });
  });

  // ---------------------------------------------------------------------------
  // getItineraryById
  // ---------------------------------------------------------------------------
  describe('getItineraryById', () => {
    it('should return an itinerary if it exists and belongs to the user', async () => {
      const itineraryId = 'itinerary-uuid';
      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Test Itinerary',
        description: 'Test description',
        user: dummyUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;
      (entityManager.findOne as jest.Mock).mockResolvedValue(mockItinerary);

      const result = await itinerariesService.getItineraryById(itineraryId, dummyUser.uuid);
      expect(entityManager.findOne).toHaveBeenCalledWith(Itinerary, { uuid: itineraryId });
      expect(entityManager.populate).toHaveBeenCalledWith(mockItinerary, ['locations']);
      expect(result).toEqual(mockItinerary);
    });

    it('should throw NotFoundException if itinerary does not exist', async () => {
      (entityManager.findOne as jest.Mock).mockResolvedValue(null);
      await expect(itinerariesService.getItineraryById('non-existent-id', dummyUser.uuid))
          .rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if itinerary does not belong to the user', async () => {
      const itineraryId = 'itinerary-uuid';
      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Test Itinerary',
        description: 'Test description',
        // Different user
        user: { ...dummyUser, uuid: 'other-user' },
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;
      (entityManager.findOne as jest.Mock).mockResolvedValue(mockItinerary);
      await expect(itinerariesService.getItineraryById(itineraryId, dummyUser.uuid))
          .rejects.toThrow(UnauthorizedException);
    });
  });

  // ---------------------------------------------------------------------------
  // createItinerary
  // ---------------------------------------------------------------------------
  describe('createItinerary', () => {
    it('should create a new itinerary for the authenticated user', async () => {
      const dto: CreateItineraryDto = {
        title: 'New Itinerary',
        description: 'Test description',
      };
      // Simulate finding the user in the database.
      (entityManager.findOne as jest.Mock).mockResolvedValue(dummyUser);

      const mockItinerary: Itinerary = {
        uuid: 'created-id',
        title: dto.title,
        description: dto.description,
        user: dummyUser,
        // For testing, we simulate the locations collection and its init method.
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;
      (entityManager.create as jest.Mock).mockReturnValue(mockItinerary);
      (entityManager.persistAndFlush as jest.Mock).mockResolvedValue(undefined);
      // Simulate the init() call on the collection (do nothing here)
      jest.spyOn(mockItinerary.locations, 'init').mockReturnValue(undefined);

      const result = await itinerariesService.createItinerary(dto, dummyUser.uuid);
      expect(entityManager.findOne).toHaveBeenCalledWith(User, { uuid: dummyUser.uuid });
      expect(entityManager.create).toHaveBeenCalledWith(Itinerary, { ...dto, user: dummyUser });
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockItinerary);
      expect(result).toEqual(mockItinerary);
    });

    it('should throw NotFoundException if the user is not found', async () => {
      (entityManager.findOne as jest.Mock).mockResolvedValue(null);
      const dto: CreateItineraryDto = {
        title: 'New Itinerary',
        description: 'Test description',
      };
      await expect(itinerariesService.createItinerary(dto, 'invalid-user'))
          .rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // updateItinerary
  // ---------------------------------------------------------------------------
  describe('updateItinerary', () => {
    it('should update an existing itinerary', async () => {
      const itineraryId = 'itinerary-uuid';
      const updateDto: Partial<UpdateItineraryDto> = { title: 'Updated Title' };

      // Create a valid itinerary that belongs to dummyUser.
      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Old Title',
        description: 'Old Description',
        user: dummyUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;
      // Spy on getItineraryById to return the mock itinerary.
      jest.spyOn(itinerariesService, 'getItineraryById').mockResolvedValue(mockItinerary);

      await itinerariesService.updateItinerary(itineraryId, updateDto, dummyUser.uuid);

      expect(entityManager.assign).toHaveBeenCalledWith(mockItinerary, updateDto);
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockItinerary);
      expect(entityManager.populate).toHaveBeenCalledWith(mockItinerary, ['locations']);
    });

    it('should throw NotFoundException if itinerary does not exist', async () => {
      jest.spyOn(itinerariesService, 'getItineraryById')
          .mockRejectedValue(new NotFoundException());
      await expect(itinerariesService.updateItinerary('missing-id', {}, dummyUser.uuid))
          .rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // deleteItinerary
  // ---------------------------------------------------------------------------
  describe('deleteItinerary', () => {
    it('should delete the itinerary if it exists and belongs to the user', async () => {
      const itineraryId = 'itinerary-uuid';
      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Test Itinerary',
        description: 'Test Description',
        user: dummyUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;
      jest.spyOn(itinerariesService, 'getItineraryById').mockResolvedValue(mockItinerary);

      await itinerariesService.deleteItinerary(itineraryId, dummyUser.uuid);
      expect(entityManager.removeAndFlush).toHaveBeenCalledWith(mockItinerary);
    });

    it('should throw NotFoundException if the itinerary does not exist', async () => {
      jest.spyOn(itinerariesService, 'getItineraryById')
          .mockRejectedValue(new NotFoundException());
      await expect(itinerariesService.deleteItinerary('missing-id', dummyUser.uuid))
          .rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // createLocation
  // ---------------------------------------------------------------------------
  describe('createLocation', () => {
    it('should create a new location within a specific itinerary', async () => {
      const itineraryId = 'itinerary-uuid';
      const dto: CreateLocationDto = {
        photoURI: 'http://example.com/photo.jpg',
        title: 'New Location',
        description: 'Location description',
        formattedAddress: '123 Main St',
      };

      // Create a mock itinerary that belongs to dummyUser.
      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Test Itinerary',
        description: 'Test Description',
        user: dummyUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;
      jest.spyOn(itinerariesService, 'getItineraryById').mockResolvedValue(mockItinerary);

      // Create a dummy location.
      const mockLocation: Location = {
        uuid: 'loc-uuid',
        photoURI: dto.photoURI,
        title: dto.title,
        description: dto.description,
        formattedAddress: dto.formattedAddress,
      } as Location;
      (entityManager.create as jest.Mock).mockReturnValue(mockLocation);
      (entityManager.persistAndFlush as jest.Mock).mockResolvedValue(undefined);

      const result = await itinerariesService.createLocation(itineraryId, dto, dummyUser.uuid);
      expect(entityManager.create).toHaveBeenCalledWith(Location, expect.objectContaining({
        ...dto,
        itinerary: mockItinerary,
        // uuid is generated, so we can use expect.any(String)
        uuid: expect.any(String),
      }));
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockLocation);
      expect(result).toEqual(mockLocation);
    });
  });

  // ---------------------------------------------------------------------------
  // updateLocation
  // ---------------------------------------------------------------------------
  describe('updateLocation', () => {
    it('should update an existing location within an itinerary', async () => {
      const itineraryId = 'itinerary-uuid';
      const locationId = 'loc-uuid';
      const updateDto: Partial<UpdateLocationDto> = { title: 'Updated Location Title' };

      // Create a dummy location.
      const mockLocation: Location = {
        uuid: locationId,
        photoURI: 'http://example.com/photo.jpg',
        title: 'Old Title',
        description: 'Old description',
        formattedAddress: '123 Main St',
      } as Location;
      // Spy on getLocationById to return the mock location.
      jest.spyOn(itinerariesService, 'getLocationById').mockResolvedValue(mockLocation);

      await itinerariesService.updateLocation(itineraryId, locationId, updateDto, dummyUser.uuid);
      expect(entityManager.assign).toHaveBeenCalledWith(mockLocation, updateDto);
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockLocation);
    });

    it('should throw NotFoundException if the location does not exist', async () => {
      jest.spyOn(itinerariesService, 'getLocationById')
          .mockRejectedValue(new NotFoundException('Location not found'));
      await expect(
          itinerariesService.updateLocation('itinerary-uuid', 'non-existent-loc', {}, dummyUser.uuid)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // deleteLocation
  // ---------------------------------------------------------------------------
  describe('deleteLocation', () => {
    it('should delete a location from an itinerary', async () => {
      const itineraryId = 'itinerary-uuid';
      const locationId = 'loc-uuid';
      const mockLocation: Location = {
        uuid: locationId,
        photoURI: 'http://example.com/photo.jpg',
        title: 'Test Location',
        description: 'Test Description',
        formattedAddress: '123 Main St',
      } as Location;
      jest.spyOn(itinerariesService, 'getLocationById').mockResolvedValue(mockLocation);

      await itinerariesService.deleteLocation(itineraryId, locationId, dummyUser.uuid);
      expect(entityManager.removeAndFlush).toHaveBeenCalledWith(mockLocation);
    });

    it('should throw NotFoundException if the location does not exist', async () => {
      jest.spyOn(itinerariesService, 'getLocationById')
          .mockRejectedValue(new NotFoundException('Location not found'));
      await expect(
          itinerariesService.deleteLocation('itinerary-uuid', 'non-existent-loc', dummyUser.uuid)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // getLocationById
  // ---------------------------------------------------------------------------
  describe('getLocationById', () => {
    it('should return the location if it exists in the itinerary', async () => {
      const itineraryId = 'itinerary-uuid';
      const locationId = 'loc-uuid';

      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Test Itinerary',
        description: 'Test Description',
        user: dummyUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;

      const mockLocation: Location = {
        uuid: locationId,
        photoURI: 'http://example.com/photo.jpg',
        title: 'Test Location',
        description: 'Test Description',
        formattedAddress: '123 Main St',
      } as Location;

      // First, getItineraryById should return the itinerary.
      jest.spyOn(itinerariesService, 'getItineraryById').mockResolvedValue(mockItinerary);
      (entityManager.findOne as jest.Mock).mockResolvedValue(mockLocation);

      const result = await itinerariesService.getLocationById(itineraryId, locationId, dummyUser.uuid);
      expect(entityManager.findOne).toHaveBeenCalledWith(Location, { uuid: locationId, itinerary: mockItinerary });
      expect(result).toEqual(mockLocation);
    });

    it('should throw NotFoundException if the location is not found', async () => {
      const itineraryId = 'itinerary-uuid';
      const locationId = 'non-existent-loc';

      const mockItinerary: Itinerary = {
        uuid: itineraryId,
        title: 'Test Itinerary',
        description: 'Test Description',
        user: dummyUser,
        locations: new Collection<Location>(null as any, []),
      } as Itinerary;

      jest.spyOn(itinerariesService, 'getItineraryById').mockResolvedValue(mockItinerary);
      (entityManager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
          itinerariesService.getLocationById(itineraryId, locationId, dummyUser.uuid)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
