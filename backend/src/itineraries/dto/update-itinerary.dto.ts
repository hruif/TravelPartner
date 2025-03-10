import { IsString, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for updating an itinerary.
 */
export class UpdateItineraryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}
