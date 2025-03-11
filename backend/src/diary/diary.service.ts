import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { DiaryEntry } from './diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { User } from '../users/user.entity';

/**
 * Service for handling diary entry operations.
 */
@Injectable()
export class DiaryService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Retrieves all diary entries for the authenticated user.
   *
   * @param userUuid - The uuid of the authenticated user.
   * @param journal - Optional journal filter to match the diary's journal string.
   * @returns An array of diary entries.
   */
  async getAllEntries(userUuid: string, journal?: string): Promise<DiaryEntry[]> {
    // Build filter with the authenticated user.
    const filter: any = { user: { uuid: userUuid } };

    // If a journal filter is provided, add it to the filter.
    if (journal) {
      filter.journal = journal;
      // For substring matching, you might use MikroORM's QueryBuilder or additional operators.
    }

    return await this.em.find(DiaryEntry, filter);
  }

  /**
   * Retrieves a specific diary entry by its unique identifier.
   *
   * @param id - The unique identifier of the diary entry.
   * @returns The diary entry.
   * @throws {NotFoundException} if the diary entry does not exist.
   */
  async getEntryById(id: string): Promise<DiaryEntry> {
    const entry = await this.em.findOne(DiaryEntry, { uuid: id });
    if (!entry) {
      throw new NotFoundException(`Diary entry with id ${id} not found`);
    }
    return entry;
  }

  /**
   * Creates a new diary entry associated with the authenticated user.
   *
   * @param dto - The data for creating the diary entry.
   * @param userUuid - The uuid extracted from the JWT token payload.
   * @returns The newly created diary entry.
   * @throws {NotFoundException} if the user is not found.
   */
  async createEntry(
      dto: CreateDiaryEntryDto,
      userUuid: string,
  ): Promise<DiaryEntry> {
    const user = await this.em.findOne(User, { uuid: userUuid });
    if (!user) {
      throw new NotFoundException(`User with uuid ${userUuid} not found`);
    }
    const entry = this.em.create(DiaryEntry, { ...dto, user }) as DiaryEntry;
    await this.em.persistAndFlush(entry);
    return entry;
  }

  /**
   * Updates an existing diary entry.
   *
   * @param id - The unique identifier of the diary entry.
   * @param dto - The data to update the diary entry.
   * @param userUuid - The uuid of the authenticated user.
   * @returns The updated diary entry.
   * @throws {NotFoundException} if the diary entry does not exist.
   * @throws {UnauthorizedException} if the authenticated user is not the owner of the diary entry.
   */
  async updateEntry(
      id: string,
      dto: Partial<DiaryEntry>,
      userUuid: string,
  ): Promise<DiaryEntry> {
    const entry = await this.getEntryById(id);
    if (!entry) {
      throw new NotFoundException(`Diary entry with id ${id} not found`);
    }
    if (entry.user.uuid !== userUuid) {
      throw new UnauthorizedException(
          'You are not allowed to update this entry',
      );
    }
    this.em.assign(entry, dto);
    await this.em.persistAndFlush(entry);
    return entry;
  }

  /**
   * Deletes a diary entry.
   *
   * @param id - The unique identifier of the diary entry.
   * @param userUuid - The uuid of the authenticated user.
   * @returns void.
   * @throws {NotFoundException} if the diary entry does not exist.
   * @throws {UnauthorizedException} if the authenticated user is not the owner of the diary entry.
   */
  async deleteEntry(id: string, userUuid: string): Promise<void> {
    const entry = await this.getEntryById(id);
    if (!entry) {
      throw new NotFoundException(`Diary entry with id ${id} not found`);
    }
    if (entry.user.uuid !== userUuid) {
      throw new UnauthorizedException(
          'You are not allowed to delete this entry',
      );
    }
    await this.em.removeAndFlush(entry);
  }

  /**
   * Retrieves diary entries from all users using pagination.
   *
   * @param page The page number (starting from 1).
   * @param limit The number of entries per page.
   * @returns {Promise<DiaryEntry[]>} An array of diary entries.
   */
  async getAllEntriesPaginated(page: number, limit: number): Promise<DiaryEntry[]> {
    const offset = (page - 1) * limit;
    return this.em.find(DiaryEntry, {}, { limit, offset });
  }
}
