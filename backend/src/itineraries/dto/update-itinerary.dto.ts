import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for updating an existing itinerary.
 * All properties are optional.
 */
export class UpdateItineraryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
