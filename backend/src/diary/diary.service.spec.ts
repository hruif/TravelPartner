import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM, EntityManager } from '@mikro-orm/postgresql';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryEntry } from './diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { User } from '../users/user.entity';

describe('DiaryService', () => {
  let diaryService: DiaryService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    // Create a mock for MikroORM, which includes the mock entityManager
    const mockOrm = {
      em: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        assign: jest.fn(),
        persistAndFlush: jest.fn(),
        removeAndFlush: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiaryService,
        {
          provide: MikroORM,
          useValue: mockOrm,
        },
        {
          provide: EntityManager,
          useFactory: (orm: MikroORM) => orm.em,
          inject: [MikroORM],
        },
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(diaryService).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // getAllEntries
  // ---------------------------------------------------------------------------
  describe('getAllEntries', () => {
    it('should return an array of diary entries for a given user', async () => {
      const userUuid = 'test-user-uuid';
      const mockDiaryEntries = [
        { uuid: 'entry-1', title: 'Entry 1' },
        { uuid: 'entry-2', title: 'Entry 2' },
      ] as DiaryEntry[];

      (entityManager.find as jest.Mock).mockResolvedValue(mockDiaryEntries);

      const result = await diaryService.getAllEntries(userUuid);

      expect(entityManager.find).toHaveBeenCalledWith(DiaryEntry, {
        user: { uuid: userUuid },
      });
      expect(result).toEqual(mockDiaryEntries);
    });
  });

  // ---------------------------------------------------------------------------
  // getEntryById
  // ---------------------------------------------------------------------------
  describe('getEntryById', () => {
    it('should return the diary entry if it exists', async () => {
      const entryId = 'entry-uuid';
      const mockEntry = { uuid: entryId, title: 'My Entry' } as DiaryEntry;

      (entityManager.findOne as jest.Mock).mockResolvedValue(mockEntry);

      const result = await diaryService.getEntryById(entryId);
      expect(entityManager.findOne).toHaveBeenCalledWith(DiaryEntry, {
        uuid: entryId,
      });
      expect(result).toEqual(mockEntry);
    });

    it('should throw NotFoundException if the diary entry does not exist', async () => {
      (entityManager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        diaryService.getEntryById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // createEntry
  // ---------------------------------------------------------------------------
  describe('createEntry', () => {
    it('should create a new diary entry for the authenticated user', async () => {
      const userUuid = 'test-user-uuid';
      const mockUser = { uuid: userUuid } as User;
      const dto: CreateDiaryEntryDto = {
        title: 'New Entry',
        description: 'Test Description',
        photoURI: 'http://example.com/photo.jpg',
        price: 100,
        rating: 4,
        formattedAddress: '123 Test Street',
      };
      const mockEntry = {
        uuid: 'entry-uuid',
        ...dto,
        user: mockUser,
      } as DiaryEntry;

      (entityManager.findOne as jest.Mock).mockResolvedValue(mockUser);
      (entityManager.create as jest.Mock).mockReturnValue(mockEntry);

      const result = await diaryService.createEntry(dto, userUuid);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        uuid: userUuid,
      });
      expect(entityManager.create).toHaveBeenCalledWith(DiaryEntry, {
        ...dto,
        user: mockUser,
      });
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockEntry);
      expect(result).toEqual(mockEntry);
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      const userUuid = 'invalid-user';
      const dto: CreateDiaryEntryDto = {
        title: 'New Entry',
        price: 0,
        rating: 5,
      };

      (entityManager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(diaryService.createEntry(dto, userUuid)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // updateEntry
  // ---------------------------------------------------------------------------
  describe('updateEntry', () => {
    it('should update the diary entry if the user is the owner', async () => {
      const entryId = 'test-entry-uuid';
      const userUuid = 'test-user-uuid';
      const mockEntry = {
        uuid: entryId,
        user: { uuid: userUuid },
        title: 'Old Title',
      } as DiaryEntry;

      // Spy on getEntryById to mock the returned entry
      jest.spyOn(diaryService, 'getEntryById').mockResolvedValue(mockEntry);

      const updateData = { title: 'Updated Title' };
      await diaryService.updateEntry(entryId, updateData, userUuid);

      expect(diaryService.getEntryById).toHaveBeenCalledWith(entryId);
      expect(entityManager.assign).toHaveBeenCalledWith(mockEntry, updateData);
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(mockEntry);
    });

    it('should throw NotFoundException if the diary entry does not exist', async () => {
      jest
        .spyOn(diaryService, 'getEntryById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        diaryService.updateEntry('missing-id', {}, 'test-user-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the user is not the owner', async () => {
      const entryId = 'test-entry-uuid';
      const mockEntry = {
        uuid: entryId,
        user: { uuid: 'other-user-uuid' },
      } as DiaryEntry;

      jest.spyOn(diaryService, 'getEntryById').mockResolvedValue(mockEntry);

      // Here we test that a different user tries to update
      await expect(
        diaryService.updateEntry(entryId, {}, 'test-user-uuid'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ---------------------------------------------------------------------------
  // deleteEntry
  // ---------------------------------------------------------------------------
  describe('deleteEntry', () => {
    it('should delete the diary entry if the user is the owner', async () => {
      const entryId = 'test-entry-uuid';
      const userUuid = 'test-user-uuid';
      const mockEntry = {
        uuid: entryId,
        user: { uuid: userUuid },
      } as DiaryEntry;

      jest.spyOn(diaryService, 'getEntryById').mockResolvedValue(mockEntry);

      await diaryService.deleteEntry(entryId, userUuid);

      expect(diaryService.getEntryById).toHaveBeenCalledWith(entryId);
      expect(entityManager.removeAndFlush).toHaveBeenCalledWith(mockEntry);
    });

    it('should throw NotFoundException if the diary entry does not exist', async () => {
      jest
        .spyOn(diaryService, 'getEntryById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        diaryService.deleteEntry('missing-id', 'test-user-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the user is not the owner', async () => {
      const entryId = 'test-entry-uuid';
      const mockEntry = {
        uuid: entryId,
        user: { uuid: 'other-user-uuid' },
      } as DiaryEntry;

      jest.spyOn(diaryService, 'getEntryById').mockResolvedValue(mockEntry);

      // Here we test that a different user tries to delete
      await expect(
        diaryService.deleteEntry(entryId, 'test-user-uuid'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAllEntriesPaginated', () => {
    it('should return paginated diary entries', async () => {
      const mockEntries: DiaryEntry[] = [
        { uuid: 'entry-1', title: 'Entry 1' } as DiaryEntry,
        { uuid: 'entry-2', title: 'Entry 2' } as DiaryEntry,
      ];
      (entityManager.find as jest.Mock).mockResolvedValue(mockEntries);

      const page = 2;
      const limit = 5;
      const offset = (page - 1) * limit; // expected offset = 5

      const result = await diaryService.getAllEntriesPaginated(page, limit);
      expect(entityManager.find).toHaveBeenCalledWith(DiaryEntry, {}, { limit, offset });
      expect(result).toEqual(mockEntries);
    });
  });

});
