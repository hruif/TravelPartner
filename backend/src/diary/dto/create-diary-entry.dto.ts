import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a diary entry.
 */
export class CreateDiaryEntryDto {
  /**
   * Title of the diary entry.
   */
  title: string;

  /**
   * Description of the diary entry.
   */
  description?: string;

  @ApiPropertyOptional({ description: 'URI of the selected photo' })
  /**
   * URI of the selected photo.
   */
  photoURI?: string;

  @ApiPropertyOptional({
    description: 'Price associated with the entry',
    default: 0,
  })
  /**
   * Price associated with the entry.
   */
  price: number;

  /**
   * Rating for the entry
   */
  rating: number;

  /**
   * Formatted address for the location.
   */
  formattedAddress?: string;
}
