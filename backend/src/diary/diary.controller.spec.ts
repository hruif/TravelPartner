import { Test, TestingModule } from '@nestjs/testing';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { DiaryEntry } from './diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('DiaryController', () => {
  let diaryController: DiaryController;
  let diaryService: DiaryService;

  // Mock implementation of the DiaryService
  const mockDiaryService = {
    getAllEntries: jest.fn(),
    getEntryById: jest.fn(),
    createEntry: jest.fn(),
    updateEntry: jest.fn(),
    deleteEntry: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryController],
      providers: [
        {
          provide: DiaryService,
          useValue: mockDiaryService,
        },
      ],
    }).compile();

    diaryController = module.get<DiaryController>(DiaryController);
    diaryService = module.get<DiaryService>(DiaryService);
  });

  it('should be defined', () => {
    expect(diaryController).toBeDefined();
  });

  describe('getAllEntries', () => {
    it('should return an array of diary entries', async () => {
      const mockUser = { uuid: 'user-uuid' };
      const mockEntries: DiaryEntry[] = [
        { uuid: '1', title: 'Entry 1' } as DiaryEntry,
        { uuid: '2', title: 'Entry 2' } as DiaryEntry,
      ];

      diaryService.getAllEntries = jest.fn().mockResolvedValue(mockEntries);

      const result = await diaryController.getAllEntries(mockUser);
      expect(result).toEqual(mockEntries);
      expect(diaryService.getAllEntries).toHaveBeenCalledWith(mockUser.uuid);
    });
  });

  describe('getEntry', () => {
    it('should return a single diary entry by uuid', async () => {
      const mockEntry = {
        uuid: 'entry-uuid',
        title: 'Test Entry',
      } as DiaryEntry;
      diaryService.getEntryById = jest.fn().mockResolvedValue(mockEntry);

      const result = await diaryController.getEntry('entry-uuid');
      expect(result).toEqual(mockEntry);
      expect(diaryService.getEntryById).toHaveBeenCalledWith('entry-uuid');
    });

    it('should throw a NotFoundException if entry does not exist', async () => {
      diaryService.getEntryById = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Entry not found'));

      await expect(diaryController.getEntry('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(diaryService.getEntryById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('createEntry', () => {
    it('should create a new diary entry', async () => {
      const mockUser = { uuid: 'user-uuid' };
      const dto: CreateDiaryEntryDto = {
        title: 'New Entry',
        description: 'Test Description',
        price: 100,
        rating: 5,
      };
      const createdEntry: DiaryEntry = {
        uuid: 'created-id',
        title: dto.title,
        user: mockUser,
      } as DiaryEntry;

      diaryService.createEntry = jest.fn().mockResolvedValue(createdEntry);

      const result = await diaryController.createEntry(dto, mockUser);
      expect(result).toEqual(createdEntry);
      expect(diaryService.createEntry).toHaveBeenCalledWith(dto, mockUser.uuid);
    });

    it('should throw NotFoundException if the user is not found in the service', async () => {
      const mockUser = { uuid: 'invalid-user' };
      diaryService.createEntry = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        diaryController.createEntry(
          {
            title: 'Fails',
            description: 'Test Description',
            price: 100,
            rating: 5,
          },
          mockUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEntry', () => {
    it('should update an existing diary entry', async () => {
      const mockUser = { uuid: 'user-uuid' };
      const partialUpdate = { title: 'Updated Title' };
      const updatedEntry: DiaryEntry = {
        uuid: 'entry-uuid',
        title: 'Updated Title',
        user: mockUser,
      } as DiaryEntry;

      diaryService.updateEntry = jest.fn().mockResolvedValue(updatedEntry);

      const result = await diaryController.updateEntry(
        'entry-uuid',
        partialUpdate,
        mockUser,
      );
      expect(result).toEqual(updatedEntry);
      expect(diaryService.updateEntry).toHaveBeenCalledWith(
        'entry-uuid',
        partialUpdate,
        mockUser.uuid,
      );
    });

    it('should throw NotFoundException if the entry does not exist', async () => {
      diaryService.updateEntry = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Entry not found'));

      await expect(
        diaryController.updateEntry(
          'non-existent-id',
          {},
          { uuid: 'user-uuid' },
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the user is not the owner', async () => {
      diaryService.updateEntry = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Not allowed'));

      await expect(
        diaryController.updateEntry(
          'entry-uuid',
          {},
          { uuid: 'wrong-user-uuid' },
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteEntry', () => {
    it('should delete a diary entry', async () => {
      const mockUser = { uuid: 'user-uuid' };
      diaryService.deleteEntry = jest.fn().mockResolvedValue(undefined);

      await diaryController.deleteEntry('entry-uuid', mockUser);
      expect(diaryService.deleteEntry).toHaveBeenCalledWith(
        'entry-uuid',
        mockUser.uuid,
      );
    });

    it('should throw NotFoundException if the entry does not exist', async () => {
      diaryService.deleteEntry = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Entry not found'));

      await expect(
        diaryController.deleteEntry('non-existent-id', { uuid: 'user-uuid' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the user is not the owner', async () => {
      diaryService.deleteEntry = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Not allowed'));

      await expect(
        diaryController.deleteEntry('entry-uuid', { uuid: 'wrong-user-uuid' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAllEntriesPaginated', () => {
    it('should return paginated entries with default page and limit', async () => {
      const mockEntries: DiaryEntry[] = [
        { uuid: '1', title: 'Entry 1' } as DiaryEntry,
        { uuid: '2', title: 'Entry 2' } as DiaryEntry,
      ];
      // Set up the mock to resolve with some diary entries.
      diaryService.getAllEntriesPaginated = jest.fn().mockResolvedValue(mockEntries);

      // When no query parameters are provided, the default page '1' and limit '10' should be used.
      const result = await diaryController.getAllEntriesPaginated();
      expect(diaryService.getAllEntriesPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockEntries);
    });

    it('should return paginated entries with provided page and limit', async () => {
      const mockEntries: DiaryEntry[] = [
        { uuid: '1', title: 'Entry 1' } as DiaryEntry,
      ];
      diaryService.getAllEntriesPaginated = jest.fn().mockResolvedValue(mockEntries);

      const result = await diaryController.getAllEntriesPaginated('2', '5');
      expect(diaryService.getAllEntriesPaginated).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(mockEntries);
    });

    it('should clamp limit to 10 if provided limit exceeds 10', async () => {
      const mockEntries: DiaryEntry[] = [
        { uuid: '1', title: 'Entry 1' } as DiaryEntry,
      ];
      diaryService.getAllEntriesPaginated = jest.fn().mockResolvedValue(mockEntries);

      // Provide a limit greater than 10; the endpoint should clamp the limit to 10.
      const result = await diaryController.getAllEntriesPaginated('1', '20');
      expect(diaryService.getAllEntriesPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockEntries);
    });
  });
});
