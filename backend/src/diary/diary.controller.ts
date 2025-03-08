import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body, Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryEntry } from './diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { GetUser } from '../auth/get-user.decorator';

/**
 * Controller for diary entry endpoints.
 */
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /**
   * Retrieves all diary entries.
   *
   * @returns {Promise<DiaryEntry[]>} An array of diary entries.
   */
  @Get('entries')
  async getAllEntries(@GetUser() user): Promise<DiaryEntry[]> {
    return this.diaryService.getAllEntries(user.uuid);
  }

  /**
   * Retrieves a specific diary entry by its uuid.
   *
   * @param id The unique identifier of the diary entry.
   * @returns {Promise<DiaryEntry>} The diary entry.
   * @throws {404} Diary entry not found.
   */
  @Get('entry/:id')
  async getEntry(@Param('id') id: string): Promise<DiaryEntry> {
    return this.diaryService.getEntryById(id);
  }

  /**
   * Creates a new diary entry.
   *
   * @param dto The data for creating the diary entry.
   * @param user The authenticated user's token payload containing the uuid.
   * @returns {Promise<DiaryEntry>} The newly created diary entry.
   * @throws {201} Diary entry created successfully.
   * @throws {404} User not found.
   */
  @Post('entry')
  async createEntry(
    @Body() dto: CreateDiaryEntryDto,
    @GetUser() user,
  ): Promise<DiaryEntry> {
    return this.diaryService.createEntry(dto, user.uuid);
  }

  /**
   * Updates an existing diary entry.
   *
   * @param id The unique identifier of the diary entry.
   * @param dto The data to update the diary entry.
   * @param user The authenticated user's token payload containing the uuid.
   * @returns {Promise<DiaryEntry>} The updated diary entry.
   * @throws {200} Diary entry updated successfully.
   * @throws {404} Diary entry not found.
   * @throws {401} Unauthorized if the user is not the owner.
   */
  @Put('entry/:id')
  async updateEntry(
    @Param('id') id: string,
    @Body() dto: Partial<DiaryEntry>,
    @GetUser() user,
  ): Promise<DiaryEntry> {
    return this.diaryService.updateEntry(id, dto, user.uuid);
  }

  /**
   * Deletes a diary entry.
   *
   * @param id The unique identifier of the diary entry.
   * @param user The authenticated user's token payload containing the uuid.
   * @returns {Promise<void>} Void.
   * @throws {200} Diary entry deleted successfully.
   * @throws {404} Diary entry not found.
   * @throws {401} Unauthorized if the user is not the owner.
   */
  @Delete('entry/:id')
  async deleteEntry(@Param('id') id: string, @GetUser() user): Promise<void> {
    return this.diaryService.deleteEntry(id, user.uuid);
  }

  /**
   * Retrieves all diary entries paginated.
   *
   * @param page The page number.
   * @param limit The number of entries per page.
   * @returns {Promise<DiaryEntry[]>} An array of diary entries.
   * @throws {401} Unauthorized if not logged in.
   */
  @Get('entries/all')
  async getAllEntriesPaginated(
      @Query('page') page: string = '1',
      @Query('limit') limit: string = '10',
  ): Promise<DiaryEntry[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const limitNumber = Math.min(parsedLimit, 10);
    return this.diaryService.getAllEntriesPaginated(pageNumber, limitNumber);
  }
}
